import React, { createContext, useContext, useMemo, useState } from 'react';

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
  saveResource: (resource: Resource) => Promise<void>;
  removeResource: (resourceId: string) => Promise<void>;
  isResourceSaved: (resourceId: string) => boolean;
};

const SavedContext = createContext<SavedContextValue | undefined>(undefined);

export function SavedProvider({ children }: { children: React.ReactNode }) {
  const [savedResources, setSavedResources] = useState<Resource[]>([]);

  const saveResource = async (resource: Resource) => {
    setSavedResources((currentResources) => {
      if (currentResources.some((item) => item.id === resource.id)) {
        return currentResources;
      }

      return [...currentResources, resource];
    });
  };

  const removeResource = async (resourceId: string) => {
    setSavedResources((currentResources) =>
      currentResources.filter((resource) => resource.id !== resourceId),
    );
  };

  const isResourceSaved = (resourceId: string) =>
    savedResources.some((resource) => resource.id === resourceId);

  const value = useMemo<SavedContextValue>(
    () => ({
      savedResources,
      saveResource,
      removeResource,
      isResourceSaved,
    }),
    [savedResources],
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
