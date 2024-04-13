
"use client";

import { logOut } from "@/redux/features/authSlice";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";

import supabase from "../../../../supabase";
import "../../../styles/dashboard/sidebar/Actions.css";

export type ActionIcon = {
    id: string,
    svg: SVGElement | any,
    activeSvg: SVGElement | any,
    href: string
}

export default function Actions({ icons }: { icons: Array<ActionIcon> }) {

    const pathname: string = usePathname();

    const dispatch = useDispatch();

    return (
        <>
            <div className="actions-container">
                
                <div className="items">
                    <div className="links">
                        
                        <Image src="https://cdn.sideforge.io/Sentinel/Primary%20Logomark%20-%20Housed.png" alt="logo" width="75" height="75" />
                    {

                    // Go through each link provided
                    icons.map((links: ActionIcon) => {
                        return <Link
                            key={ `${links.id}-link` }
                            className={ !pathname.includes(links.href) ? "link" : "link active" }
                            href={ links.href }
                        >
                            { !pathname.includes(links.href) ? links.svg : links.activeSvg }
                        </Link>
                    })

                    }

                    </div>

                    <div className="actions">
                        
                        <div className="links">

                            <button className="link" onClick={() => { supabase.auth.signOut(); dispatch(logOut()) }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                                    <path d="M23.9908 12.5513C23.901 14.1433 24.1932 16.054 23.7047 17.9271C22.2011 23.6938 15.0514 26.0465 10.3595 22.3123C10.0049 22.0296 9.63662 21.732 9.6001 21.2374C9.56509 20.7533 9.75076 20.3535 10.1951 20.1114C10.7232 19.8243 11.1935 19.928 11.6577 20.2963C13.6543 21.8778 15.855 22.2491 18.1788 21.1457C20.3171 20.1325 21.4843 18.3706 21.5559 16.0255C21.6304 13.551 21.6304 11.0721 21.5604 8.59764C21.4904 6.12471 20.2531 4.30571 17.9627 3.31654C15.7941 2.37998 13.7091 2.69117 11.8327 4.13434C11.3183 4.5297 10.8191 4.81533 10.1814 4.45003C9.39617 4.00054 9.38551 3.0234 10.1967 2.38449C12.7108 0.41216 15.511 -0.112492 18.5334 0.981912C21.8237 2.17403 23.9178 5.17462 23.9878 8.64875C24.0121 9.84839 23.9924 11.0495 23.9924 12.5498L23.9908 12.5513Z" fill="#9A9A9A"/>
                                    <path d="M3.66488 11.1051C5.00564 11.1051 6.18813 11.1051 7.37062 11.1051C10.3337 11.1051 13.2952 11.1051 16.2583 11.1051C17.4606 11.1051 17.9826 11.4719 17.9658 12.3033C17.9491 13.1151 17.4027 13.4819 16.2096 13.4819C12.3365 13.4819 8.4618 13.4819 4.58865 13.4819C4.34211 13.4819 4.09557 13.4819 3.75467 13.4819C4.16557 14.0772 4.70127 14.4019 5.17153 14.7882C5.82897 15.3279 5.97051 15.9849 5.53069 16.5396C5.07869 17.1093 4.39385 17.165 3.72271 16.6659C2.54479 15.7909 1.49014 14.7867 0.563323 13.6547C-0.182391 12.7437 -0.185435 11.8192 0.540495 10.9277C1.46427 9.79276 2.5174 8.78705 3.69532 7.91062C4.40755 7.37996 5.10609 7.44009 5.55656 8.04893C5.97355 8.61267 5.81984 9.24556 5.14109 9.79276C4.74997 10.1085 4.36494 10.4347 3.98143 10.7594C3.90686 10.8225 3.84598 10.9052 3.6664 11.1021L3.66488 11.1051Z" fill="#9A9A9A"/>
                                </svg>
                            </button>

                        </div>

                    </div>
                </div>

            </div>
        </>
    )

}
