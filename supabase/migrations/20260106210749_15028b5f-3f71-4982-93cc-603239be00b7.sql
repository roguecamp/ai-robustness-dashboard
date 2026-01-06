-- Add owners column to ratings table for tracking aspect ownership
ALTER TABLE public.ratings ADD COLUMN owners text;