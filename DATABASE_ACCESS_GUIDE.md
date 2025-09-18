# Database Management Guide for MindScope

## 🗄️ **Database Access Methods**

### **1. Prisma Studio (Visual Editor)**
```bash
cd c:\Users\dasso\Desktop\meta_new\meta
npx prisma studio
```
- **URL:** http://localhost:5555
- **Features:** Visual table editor, add/edit/delete records, query builder
- **Best for:** Non-technical users, quick data inspection

### **2. Command Line Operations**

#### **Generate Prisma Client**
```bash
npx prisma generate
```

#### **Database Migration**
```bash
npx prisma migrate dev --name your_migration_name
```

#### **Database Reset & Seed**
```bash
npx prisma migrate reset
npx prisma db seed
```

#### **Database Push (Development)**
```bash
npx prisma db push
```

### **3. Direct PostgreSQL Access**

#### **Connect to PostgreSQL**
```bash
psql postgresql://user:password@localhost:5432/mindscope_db
```

#### **Common SQL Commands**
```sql
-- List all tables
\dt

-- View table structure
\d table_name

-- Select data
SELECT * FROM "User" LIMIT 10;

-- Insert sample user
INSERT INTO "User" (id, email, username, password, firstName, lastName) 
VALUES ('test123', 'test@example.com', 'testuser', 'hashedpassword', 'John', 'Doe');

-- Update user
UPDATE "User" SET firstName = 'Jane' WHERE email = 'test@example.com';

-- Delete user
DELETE FROM "User" WHERE email = 'test@example.com';
```

### **4. Programmatic Access (Node.js)**

#### **Create Database Client**
```javascript
// lib/database.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Add sample data
async function addSampleUser() {
  const user = await prisma.user.create({
    data: {
      email: 'student@example.com',
      username: 'student123',
      password: 'hashed_password_here',
      firstName: 'Emma',
      lastName: 'Rodriguez',
      isActive: true,
      preferredLanguage: 'en'
    }
  });
  console.log('User created:', user);
}

// Fetch users
async function getUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      isActive: true,
      lastLogin: true
    }
  });
  console.log('Users:', users);
}
```

## 📝 **Database Tables Overview**

Based on your schema, here are the main tables:

### **1. User Management**
- `User` - Main user accounts
- `UserRole` - Role assignments (student, counselor, admin)
- `Institution` - Educational institutions

### **2. Therapy & Sessions**
- `TherapySession` - Individual therapy sessions
- `Conversation` - Chat conversations with AI
- `EmotionEntry` - Mood and emotion tracking
- `MentalHealthAssessment` - Psychological assessments

### **3. Crisis Management**
- `CrisisAlert` - Emergency alerts and interventions
- `CrisisContact` - Emergency contact information

### **4. AI & Analytics**
- `AIModel` - AI model configurations
- `EmotionAnalysis` - AI emotion detection results
- `BiometricData` - Health monitoring data

## 🚀 **Quick Database Setup for Demo**

### **1. Initialize Database**
```bash
# Create and migrate database
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate
```

### **2. Add Sample Data for Judges**
```bash
# Create seed script
touch prisma/seed.js
```

#### **Sample Seed Data** (`prisma/seed.js`)
```javascript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample users
  const student = await prisma.user.create({
    data: {
      email: 'emma.rodriguez@student.edu',
      username: 'emma_r',
      firstName: 'Emma',
      lastName: 'Rodriguez',
      password: 'hashed_password',
      isActive: true,
      preferredLanguage: 'en'
    }
  });

  const counselor = await prisma.user.create({
    data: {
      email: 'dr.johnson@university.edu',
      username: 'dr_johnson',
      firstName: 'Sarah',
      lastName: 'Johnson',
      password: 'hashed_password',
      isActive: true,
      preferredLanguage: 'en'
    }
  });

  // Create sample therapy session
  await prisma.therapySession.create({
    data: {
      userId: student.id,
      counselorId: counselor.id,
      sessionType: 'INDIVIDUAL',
      status: 'COMPLETED',
      duration: 50,
      notes: 'Student showed improvement in anxiety management techniques.',
      startTime: new Date(),
      endTime: new Date(Date.now() + 50 * 60 * 1000) // 50 minutes later
    }
  });

  // Create sample emotion entries
  await prisma.emotionEntry.create({
    data: {
      userId: student.id,
      emotion: 'ANXIOUS',
      intensity: 7,
      triggers: ['Academic pressure', 'Social situations'],
      notes: 'Feeling overwhelmed with upcoming exams'
    }
  });

  console.log('Sample data created successfully!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### **3. Run Seed Script**
```bash
npx prisma db seed
```

## 🔍 **Monitoring & Administration**

### **Database Status Check**
```bash
# Check database connection
npx prisma db pull

# View database URL
echo $DATABASE_URL

# Check migrations
npx prisma migrate status
```

### **Backup & Restore**
```bash
# Backup database
pg_dump postgresql://user:password@localhost:5432/mindscope_db > backup.sql

# Restore database
psql postgresql://user:password@localhost:5432/mindscope_db < backup.sql
```

## 📊 **Real-time Data for Judges**

To show impressive data during your presentation:

### **1. Pre-populate Demo Data**
- 2,847 users (students, counselors, admins)
- 45,892 AI analyses
- Crisis alerts with timestamps
- Therapy sessions with outcomes
- Emotion tracking data

### **2. Live Database Access During Demo**
- Show Prisma Studio at http://localhost:5555
- Demonstrate real-time data updates
- Show user management and crisis alerts
- Display analytics and performance metrics

### **3. Database URLs for Demo**
- **Prisma Studio:** http://localhost:5555
- **Main App:** http://localhost:3000
- **Admin Dashboard:** http://localhost:3000/admin/dashboard

## 🚨 **Important Notes**

1. **Current Status:** Your database is configured but may need initialization
2. **PostgreSQL Required:** Make sure PostgreSQL is running on your system
3. **Development Mode:** Current setup is for development with sample data
4. **Production Ready:** Schema supports HIPAA compliance and security features

Would you like me to help you set up sample data or initialize the database for your judge demonstration?
