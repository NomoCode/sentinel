
"use client";

import { getValidAuthorizedUser } from "@/utils/Authorized";

import { useDispatch } from "react-redux";
import { AuthChangeEvent, Session } from "@supabase/gotrue-js";
import { useEffect } from "react";

import supabase from "../../../supabase";
import { AppDispatch } from "@/redux/store";
import { logIn } from "@/redux/features/authSlice";

export default function SupabaseParent({ children }: { children: React.ReactNode }) {

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {

        supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | any) => {

            switch(event) {

                case "SIGNED_IN":
                    // Redirect to the server selection page
                    break;
                case "SIGNED_OUT":
                    break;
                case "INITIAL_SESSION":

                    // Since the session could be null
                    if (!session) return;

                    switch(process.env.NEXT_PUBLIC_SUPABASE_PROVIDER) {
                        case "discord":
                            // Get the metadata from the session
                            const discord_metadata: any = session?.user.user_metadata;

                            // Get the valid user 
                            const validUser: any = await getValidAuthorizedUser(discord_metadata.sub, session.user.id);
                            
                            if (validUser.error) return;

                            // See if they're authorized
                            if (!validUser.authorized) return;

                            session['authorized'] = validUser.user;

                            dispatch(logIn({ data: session }));

                            break;
                        case "email":
                            
                            const email_metadata: any = session?.user;

                            // Get the valid user 
                            const emailValidUser: any = await getValidAuthorizedUser(email_metadata.email, email_metadata.id);

                            if (emailValidUser.error) return;

                            if (!emailValidUser.authorized) return;

                            session['authorized'] = validUser.user;

                            dispatch(logIn({ data: session }));
                            break;
                    }

                    break;
            }

        })
    }, []);

    return (
        <>
            {children}
        </>
    )
}
