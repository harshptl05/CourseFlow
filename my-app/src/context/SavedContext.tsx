import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type Resource = {
  id: string;
  title: string;
  category: string;
  description: string;
  courseCode: string;
  dateInfo: string;
};

type SavedContextValue = {
  savedResources: Resource[];
  courseAssignments: Record<string, string>;
  saveResource: (resource: Resource) => Promise<void>;
  removeResource: (resourceId: string) => Promise<void>;
  addResourceToCourse: (resourceId: string, courseCode: string) => void;
  isResourceInCourse: (resourceId: string, courseCode: string) => boolean;
  isResourceSaved: (resourceId: string) => boolean;
};

const SavedContext = createContext<SavedContextValue | undefined>(undefined);

export function SavedProvider({ children }: { children: React.ReactNode }) {
  const [savedResources, setSavedResources] = useState<Resource[]>([]);
  const [courseAssignments, setCourseAssignments] = useState<Record<string, string>>({});

  const saveResource = useCallback(async (resource: Resource) => {
    setSavedResources((currentResources) => {
      if (currentResources.some((item) => item.id === resource.id)) {
        return currentResources;
      }

      return [...currentResources, resource];
    });
  }, []);

  const removeResource = useCallback(async (resourceId: string) => {
    setSavedResources((currentResources) =>
      currentResources.filter((resource) => resource.id !== resourceId),
    );
    setCourseAssignments((currentAssignments) => {
      const remainingAssignments = { ...currentAssignments };
      delete remainingAssignments[resourceId];
      return remainingAssignments;
    });
  }, []);

  const addResourceToCourse = useCallback((resourceId: string, courseCode: string) => {
    setCourseAssignments((currentAssignments) => ({
      ...currentAssignments,
      [resourceId]: courseCode,
    }));
  }, []);

  const isResourceInCourse = useCallback(
    (resourceId: string, courseCode: string) => courseAssignments[resourceId] === courseCode,
    [courseAssignments],
  );

  const isResourceSaved = useCallback(
    (resourceId: string) => savedResources.some((resource) => resource.id === resourceId),
    [savedResources],
  );

  const value = useMemo<SavedContextValue>(
    () => ({
      savedResources,
      courseAssignments,
      saveResource,
      removeResource,
      addResourceToCourse,
      isResourceInCourse,
      isResourceSaved,
    }),
    [
      savedResources,
      courseAssignments,
      saveResource,
      removeResource,
      addResourceToCourse,
      isResourceInCourse,
      isResourceSaved,
    ],
  );

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}

export function useSaved() {
  const context = useContext(SavedContext);

  if (!context) {
    throw new Error('useSaved must be used within a SavedProvider');
  }

  return context;
}
