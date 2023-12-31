export interface User {
  id?: number
  auth_id: string
  name: string
  picture: string
  points?: number
  is_parent?: boolean
  family_id?: number
}

export interface CompleteUser extends User {
  family?: {
    id: number
    name: string
  }
  currentChore?: {
    chores_id: number
    name: string
  }
  currentGoal?: {
    name: string
    id: number
  }
  goal_name?: string
  chore_name?: string
}
