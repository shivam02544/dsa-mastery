import dbConnect from '@/lib/db';
import User from '@/models/User';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await request.json();
    const { name, bio, progressUpdate } = data;

    await dbConnect();

    // Prepare update object
    const updateFields = {};
    if (name) updateFields.name = name;
    if (bio !== undefined) updateFields.bio = bio;
    
    // If we have a progress update, we need to set the specific map key
    // We cannot just pass "progress" because it replaces the whole map in some versions or is tricky
    // Mongoose map updates usually work with $set: { "progress.key": value }
    const updateOptions = { new: true };
    let finalUpdate = {};

    if (progressUpdate) {
        // progressUpdate should be { key: 'BUBBLE', value: 100 }
        const { key, value } = progressUpdate;
        finalUpdate = {
            $set: { 
                ...updateFields, 
                [`progress.${key}`]: value 
            }
        };
    } else {
        finalUpdate = { $set: updateFields };
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      finalUpdate,
      updateOptions
    );

    return new Response(JSON.stringify(updatedUser), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
    
        if (!session) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }
    
        await dbConnect();
    
        const user = await User.findOne({ email: session.user.email });
    
        return new Response(JSON.stringify(user), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
}
