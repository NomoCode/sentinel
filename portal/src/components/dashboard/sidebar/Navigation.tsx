
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "../../../styles/dashboard/sidebar/Navigation.css";

export type NavigationLink = {
    id: string,
    svg: SVGElement | any,
    activeSvg: SVGElement | any,
    href: string
}

export type NavigationSection = {
    id: string,
    links: Array<NavigationLink>
}

export default function Navigation({ sections }: { sections: Array<NavigationSection> }) {

    const pathname: string = usePathname();

    return (
        <>

            <div className="navigation-container">

                <div className="items">

                    <div className="branding">
                        <Image src="https://cdn.sideforge.io/Sentinel/Primary%20Logomark%20-%20Housed.png" alt="logo" width="75" height="75" />
                        <p>Sentinel</p>
                    </div>

                    {  
                        sections.map((section: NavigationSection) => {
                            return (
                            <div className="section">
{/* 
                                <div className="header">
        
                                    <h1>{ section.id } </h1>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 2" fill="none">
                                        <rect width="12" height="2" rx="1" fill="#BB9C67"/>
                                    </svg>
        
                                </div> */}

                                <div className="links">

                                    {  
                                        section.links.map((link: NavigationLink) => {
                                            return (<>
                                                <Link href={ link.href } className={ pathname !== link.href ? "link" : "link active" }>
                                                {  link.href !== pathname ? link.svg : link.activeSvg } 
                                                    
                                                    <span className="text">{ link.id }</span>
                                                </Link>
                                            </>)
                                        })
                                    }

                                </div>
        
                            </div>    
                            )
                        })
                    }

                    <div className="maps">
                        <Link href="https://discord.gg/6bezPwVfXr" target="_blank">Discord</Link>
                        <Link href="https://github.com/NomoCode/sentinel" target="_blank">GitHub</Link>
                        <p className="version">1.3.0 - Made by NomoCode</p>
                    </div>

                </div>

            </div>

        </>
    )

}
