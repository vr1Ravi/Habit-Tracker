import { db } from './connection.ts'
import { users, habitTags, habits, entries, tags } from './schema.ts'

export async function seed() {
  console.log('Starting database seed....')

  try {
    console.log('Clearing existing data...')
    await db.delete(users)
    await db.delete(habitTags)
    await db.delete(habits)
    await db.delete(entries)
    await db.delete(tags)

    console.log('Creating demo users..')

    const [demoUser] = await db
      .insert(users)
      .values({
        email: 'demo@app.com',
        password: 'password',
        firstName: 'Demo',
        lastName: 'person',
        username: 'demo',
      })
      .returning()

    console.log('Creating tags..')

    const [healthTag] = await db
      .insert(tags)
      .values({
        color: '#cccc',
        name: ' Health',
      })
      .returning()

    const [exericesHabit] = await db
      .insert(habits)
      .values({
        userId: demoUser.id,
        name: 'Exercise',
        description: 'Daily workout',
        frequency: 'daily',
        targetCount: 1,
      })
      .returning()
    await db.insert(habitTags).values({
      habitId: exericesHabit.id,
      tagId: healthTag.id,
    })

    console.log('Adding completion entries...')

    const today = new Date()

    today.setHours(12, 0, 0, 0)
    for (let index = 0; index < 7; index++) {
      const date = new Date(today)
      date.setDate(date.getDate() - 1)
      await db.insert(entries).values({
        habitId: exericesHabit.id,
        completionDate: date,
      })
    }
  } catch (error) {}
}
