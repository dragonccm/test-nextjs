"use client"

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import { UserValidation } from "@/lib/validation/user";
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Textarea } from "../ui/textarea";
import { updateUser } from "@/lib/actions/user.actions";
import path from "path";
import { usePathname, useRouter } from "next/navigation";
import { ThreadValidation } from "@/lib/validation/thread";
import createThread from "@/lib/actions/thread.action";

interface Props {
    user: {
        id: string;
        objectId: string;
        username: string;
        name: string;
        bio: string;
        image: string;
    };
    btnTitle: string;
}



function PostThread({ userId }: { userId: string }) {
    const form = useForm({
        resolver: zodResolver(ThreadValidation),
        defaultValues: {
            thread: '',
            accountId: userId,
        }

    });

    const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
        await createThread({
          text: values.thread,
          author: userId,
          communityId: null,
          path: pathname,
        });
    
        router.push("/");
      };
    const router = useRouter();
    const pathname = usePathname();

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-start gap-10">

                <FormField
                    control={form.control}
                    name='thread'
                    render={({ field }) => (
                        <FormItem className='flex w-full flex-col gap-3'>
                            <FormLabel className='text-base-semibold text-light-2'>
                                Content
                            </FormLabel>
                            <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                                <Textarea
                                    rows={15}

                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

            </form>
        </Form>


    )
}
export default PostThread