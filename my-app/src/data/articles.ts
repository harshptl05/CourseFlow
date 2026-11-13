export type ArticleKind = 'news' | 'research';

export type Article = {
  id: string;
  title: string;
  source: string;
  kind: ArticleKind;
  summary: string;
  url: string;
  imageUrl?: string;
  dateInfo: string;
  readTime: string;
  courseCode: string;
};

export type CourseTopic = {
  code: string;
  title: string;
  topic: string;
  interestId: string;
  surface: 'tint' | 'cream';
  icon: number;
};

export const COURSE_TOPICS: CourseTopic[] = [
  {
    code: 'CS 4375',
    title: 'Machine Learning',
    topic: 'Machine Learning',
    interestId: 'ml',
    surface: 'tint',
    icon: require('@/assets/icons/course-ml.svg'),
  },
  {
    code: 'CS 3354',
    title: 'Software Engineering',
    topic: 'Software Engineering',
    interestId: 'se',
    surface: 'cream',
    icon: require('@/assets/icons/course-code.svg'),
  },
  {
    code: 'STAT 3355',
    title: 'Statistics',
    topic: 'Data analysis',
    interestId: 'stat',
    surface: 'tint',
    icon: require('@/assets/icons/course-ml.svg'),
  },
];

export const ARTICLES: Article[] = [
  {
    id: 'ajmc-mpn-machine-learning',
    title: 'Machine Learning Has High Accuracy, Little Prospective Validation in MPNs',
    source: 'AJMC · NEWS',
    kind: 'news',
    summary:
      'A narrative review in Blood Reviews ranks AI models for myeloproliferative neoplasms on a four-level validation hierarchy. Models grade marrow fibrosis and estimate survival with high discrimination, but none has been tested in a trial where care is guided by the model.',
    url: 'https://www.ajmc.com/view/machine-learning-has-high-accuracy-little-prospective-validation-in-mpns',
    imageUrl:
      'https://cdn.sanity.io/images/0vv8moc6/ajmc/9b3e599022a24e3dc3acbc4980c4e4a2d936fdf5-1280x800.jpg',
    dateInfo: 'Oct 31, 2026',
    readTime: '6 min read',
    courseCode: 'CS 4375',
  },
  {
    id: 'bioengineer-egfr-random-forest',
    title: 'Machine Learning Model Improves Kidney Function Estimates in Young People',
    source: 'BIOENGINEER · NEWS',
    kind: 'news',
    summary:
      'Seven algorithms and three clinical equations are compared on the same cohort. A random forest using serum creatinine, cystatin C, and demographics beats the equations, and improves further when equation outputs are fed back in as features.',
    url: 'https://bioengineer.org/machine-learning-model-improves-kidney-function-estimates-in-young-people/',
    dateInfo: 'Oct 23, 2026',
    readTime: '4 min read',
    courseCode: 'CS 4375',
  },
  {
    id: 'etcio-mercedes-software-defined-vehicle',
    title: 'Mercedes-Benz’s AI and Software-Defined Vehicle Shift',
    source: 'ETCIO · INTERVIEW',
    kind: 'news',
    summary:
      'Umang Dharmik of Mercedes-Benz R&D India describes moving from long sequential development cycles to continuous software releases, and how AI-assisted code generation, testing, and documentation change what engineers are accountable for.',
    url: 'https://cio.economictimes.indiatimes.com/news/artificial-intelligence/mercedes-benzs-ai-and-software-defined-vehicle-shift-umang-dharmik-on-the-future-of-automotive-innovation/134577358',
    dateInfo: 'Sep 30, 2026',
    readTime: '9 min read',
    courseCode: 'CS 3354',
  },
  {
    id: 'bioengineer-phynetpy-infrastructure',
    title: 'Rice Engineering Dean Pioneers Software Infrastructure for Evolutionary Biology',
    source: 'BIOENGINEER · NEWS',
    kind: 'news',
    summary:
      'A $1.9M NSF grant funds PhyNetPy, an open-source Python library for phylogenetic networks. The five-year plan covers data structures, inference, simulation, and visualization, with interoperability and cloud deployment treated as first-class requirements.',
    url: 'https://bioengineer.org/rice-universitys-engineering-dean-pioneers-innovative-software-infrastructure-for-evolutionary-biology/',
    dateInfo: 'Aug 12, 2025',
    readTime: '5 min read',
    courseCode: 'CS 3354',
  },
  {
    id: 'forbes-cleveland-clinic-analytics',
    title: 'How Cleveland Clinic Is Innovating In Healthcare With Data, Analytics, And AI',
    source: 'FORBES · NEWS',
    kind: 'news',
    summary:
      'Randy Bean profiles how Cleveland Clinic organizes its data and analytics function, and how governance and analytics practice turn clinical and operational data into decisions.',
    url: 'https://www.forbes.com/sites/randybean/2024/10/06/how-cleveland-clinic-is-innovating-in-healthcare-with-data-analytics-and-ai/',
    dateInfo: 'Oct 6, 2024',
    readTime: '7 min read',
    courseCode: 'STAT 3355',
  },
  {
    id: 'techxplore-synaps-i-xray',
    title: 'SYNAPS-I: Intelligent Computing Transforms X-ray Imaging, From Data Collection to Discovery',
    source: 'TECHXPLORE · NEWS',
    kind: 'news',
    summary:
      'A look at applying intelligent computing across the full X-ray imaging pipeline, from how measurements are collected through the analysis that turns them into results.',
    url: 'https://techxplore.com/news/2026-11-synaps-intelligent-ray-imaging-discovery.html',
    dateInfo: 'Nov 2026',
    readTime: '5 min read',
    courseCode: 'STAT 3355',
  },
  {
    id: 'tidy-data',
    title: 'Tidy Data',
    source: 'JOURNAL OF STATISTICAL SOFTWARE',
    kind: 'research',
    summary:
      'Wickham presents a consistent structure for analysis-ready datasets. Organizing observations, variables and observational units makes data easier to reshape, model and visualize.',
    url: 'https://www.jstatsoft.org/article/view/v059i10',
    dateInfo: 'Sep 12, 2014',
    readTime: '23 min read',
    courseCode: 'STAT 3355',
  },
  {
    id: 'conformal-prediction',
    title:
      'A Gentle Introduction to Conformal Prediction and Distribution-Free Uncertainty Quantification',
    source: 'ARXIV',
    kind: 'research',
    summary:
      'This tutorial introduces prediction sets and intervals that quantify uncertainty around model outputs. It combines practical theory with worked examples and Python notebooks.',
    url: 'https://arxiv.org/abs/2107.07511',
    dateInfo: 'Jul 15, 2021',
    readTime: '40 min read',
    courseCode: 'CS 4375',
  },
];

export function getCourseTopic(courseCode: string) {
  return COURSE_TOPICS.find((course) => course.code === courseCode);
}

export function findCourseByTopic(topic: string) {
  const normalized = topic.trim().toLowerCase();
  return COURSE_TOPICS.find(
    (course) =>
      course.topic.toLowerCase() === normalized ||
      course.title.toLowerCase() === normalized ||
      course.code.toLowerCase() === normalized,
  );
}

export function getArticlesForCourse(courseCode: string) {
  return ARTICLES.filter((article) => article.courseCode === courseCode);
}
