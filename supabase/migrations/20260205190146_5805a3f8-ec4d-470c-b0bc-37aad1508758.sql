-- Add missing DELETE policy to user_profiles table
-- This ensures users can only delete their own profile data

CREATE POLICY "Users can delete own user profile"
  ON public.user_profiles
  FOR DELETE
  TO authenticated
  USING (id = auth.uid());