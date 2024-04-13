
"use client";

import { useAppSelector } from "@/redux/store";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import "../../../styles/dashboard/topnav/Header.css"
import { NavigationLink, NavigationSection } from "../sidebar/Navigation";

export default function TopNavHeader({ sections }: { sections: NavigationSection[] }) {

    // Get the auth data
    const auth_data = useAppSelector((state) => { return state.authReducer.value });

    // Get the pathname to match with the links
    const pathname: string = usePathname();

    // Go through each link and see if any of their href match the current path
    // If the href does match the current path, we're going to return the id of the sidebar link
    let headerTitle = "";
    
    for (let i: number = 0; i < sections.length; i++) {
        const section: NavigationSection = sections[i];

        // Go through the links of this section
        const matchLinks: Array<NavigationLink> = section.links.filter((link: NavigationLink) => link.href === pathname);

        if (matchLinks.length > 0) headerTitle = matchLinks[0].id;
    }

    // Profile stuff
    const [profilePicture, setProfilePicture] = useState('https://cdn.discordapp.com/attachments/782093782358818828/1210784008775012372/image.png?ex=65ebd17a&is=65d95c7a&hm=5f0a0e8674a90846db70495f8b93a94a1020659d7a681dff5e362fd43aa473dc&');
    const [username, setUsername] = useState('Loading');
    const [id, setId] = useState('Loading');

    // Set profile picture and things
    useEffect(() => {

        if (!auth_data) return;
        if (!auth_data.data) return;
        if (Object.keys(auth_data.data).length == 0) return;


        setProfilePicture(auth_data.data.user.user_metadata.picture);
        setUsername(auth_data.data.user.user_metadata.full_name);
        setId(auth_data.data.user.user_metadata.sub);
        
    }, [auth_data])


    return (
        <>

            <div className="top-nav-container">
                <div className="items">
                    {/* <div className="title">
                        <p>{ headerTitle }</p> 
                    </div> */}

                    <div className="identity">
                        <Image src={ profilePicture } height="50" width="50" alt="icon" />
                        <div className="text">
                            <p className="username">Welcome back, { username }</p>
                            {/* <p className="id">ID: { id }</p> */}
                        </div>
                    </div>

                    <div className="actions">
                        <a href="/dashboard/settings">Settings</a>
                        <a>Logout</a>
                    </div>
                </div>
            </div>

        </>
    )

}
