export interface iMovie {
  id: number;
  title: string;
  poster: string;
  backdrop?: string;
  description?: string;
  genre: string;
  year: string;
  rating?: string;
}

export interface MovieRowProps {
  title: string;
  movies: iMovie[];
  isLarge?: boolean;
}

export interface MovieCardProps {
  movie: iMovie;
  isLarge?: boolean;
}

export interface HeroSectionProps {
  movie: iMovie;
}

export interface iVideo {
    id: string,
    key: string;
    name: string;
    site: string;
    type: string;
}