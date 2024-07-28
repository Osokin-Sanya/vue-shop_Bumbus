import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jlfspvmmitgyiuzekkas.supabase.co'
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsZnNwdm1taXRneWl1emVra2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc4NzM3NTAsImV4cCI6MjAzMzQ0OTc1MH0.R-spgnPsjS5gxNlV2gFDjCyyoQSNO4rMPGlIL5fd_Z8'

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
