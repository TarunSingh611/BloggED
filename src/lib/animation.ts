// lib/animations.ts
export const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  export const fadeInUp = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
    },
  };