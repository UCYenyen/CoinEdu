"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { UpdateProfileInput } from "../interfaces/profile";

export async function updateProfileAction(userId: string, data: UpdateProfileInput) {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        image: data.image,
      },
    });

    revalidatePath("/settings");
    
    return { success: true, data: updatedUser };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { success: false, error: "Failed to update profile. Please try again." };
  }
}
