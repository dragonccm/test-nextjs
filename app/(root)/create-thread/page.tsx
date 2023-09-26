import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from 'next/navigation';

async function page(){
    const user = await currentUser();
    if (!user) return null;
    const userInfo = await fetchUser(user.id);
 return(
    <h1 className="head-text">create threads</h1>
 )
}
export default page;