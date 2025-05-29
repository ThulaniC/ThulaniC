import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getUserByCredentials } from "./db"
import crypto from "crypto"

// Simple password hashing for demo purposes
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex")
}

// Simple authentication for the prototype
export async function login(username: string, password: string) {
  try {
    // Hash the provided password
    const passwordHash = hashPassword(password)

    const user = await getUserByCredentials(username, passwordHash)

    if (user) {
      // Set a cookie with the user information
      const cookieStore = await cookies()
      cookieStore.set(
        "user",
        JSON.stringify({
          id: user.user_id,
          username: user.username,
          role: user.role_name,
          locationId: user.location_id,
          locationType: user.location_type,
          permissions: user.permissions,
        }),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24, // 1 day
          path: "/",
        },
      )

      return { success: true, user }
    }

    return { success: false, error: "Invalid username or password" }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "An error occurred during login" }
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("user")
}

export async function getUser() {
  try {
    const cookieStore = await cookies()
    const userCookie = cookieStore.get("user")

    if (!userCookie) {
      return null
    }

    return JSON.parse(userCookie.value)
  } catch (error) {
    console.error("Get user error:", error)
    return null
  }
}

export async function requireAuth() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  return user
}

export async function requireRole(allowedRoles: string[]) {
  const user = await requireAuth()

  if (!allowedRoles.includes(user.role)) {
    redirect("/unauthorized")
  }

  return user
}

export async function hasPermission(permission: string) {
  const user = await getUser()

  if (!user) {
    return false
  }

  if (user.role === "manager") {
    return true
  }

  try {
    const permissions = JSON.parse(user.permissions)
    return permissions.includes(permission)
  } catch (error) {
    return false
  }
}
