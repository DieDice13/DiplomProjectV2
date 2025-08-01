﻿export type Product = {
  id: number;
  name: string;
  image: string;
  price: number;
  discount?: number;
  category: {
    name: string;
  };
};
