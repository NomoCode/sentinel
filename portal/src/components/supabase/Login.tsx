
import Image from "next/image";
import { useState } from "react";
import { useDispatch } from "react-redux";

import { logIn } from "@/redux/features/authSlice";
import { useAppSelector } from "@/redux/store";
import supabase from "../../../supabase";

import "../../styles/login/page.css";

export default function Login() {

    // State for email login
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Logging in state
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const dispatch = useDispatch();

    const loginWithDiscord = async () => {

        // Login with the Supabase auth, on the supabase dashboard
        // There are settings for how the provider works
        // You input the client id and secret key into their dashboard
        // DO NOT change the secret key or all prod and dev will break
        await supabase.auth.signInWithOAuth({
          provider: "discord",
          options: {
              scopes: "identify guilds email"
          }
        });
      
    }

    const loginWithEmail = async () => {

        setLoading(true);

        // Login with email
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error){ setLoading(false); setErrorMessage(error.message); return; }

        dispatch(logIn({ data: data }));
        setLoading(false);

    }

    // Supabase provider
    const provider: any = process.env.NEXT_PUBLIC_SUPABASE_PROVIDER;

    const formatSignInByProvider = () => {

        switch(provider) {

            case "discord":
                return (
                    <div className="button" onClick={ () => { loginWithDiscord() }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 173 141" fill="none">
                            <mask id="mask0_11_297" maskUnits="userSpaceOnUse" x="0" y="0" width="173" height="141">
                                <path d="M172.71 0H0V140.53H172.71V0Z" fill="white"/>
                            </mask>
                            <g mask="url(#mask0_11_297)">
                                <path d="M172.34 93.28C172.43 79.1 171.02 66.91 167.99 54.93C160.99 27.27 144.71 8.46001 116.5 0.980012C109.41 -0.899988 103.69 0.450011 101.43 6.72001C98.5999 14.57 93.6099 16.4 86.2999 15.19C85.4899 15.06 84.6199 15.06 83.8099 15.19C77.8399 16.13 74.1499 14.24 71.7999 8.10001C69.1399 1.16001 63.9499 -1.17999 57.4499 0.550012C35.7999 6.32001 19.0699 18.05 9.86995 39.31C0.769945 60.34 -0.700054 82.37 0.249946 104.8C0.299946 106.08 0.719946 107.46 1.35995 108.58C11.7799 127.02 27.3199 137.89 48.5199 140.43C53.7399 141.05 57.0899 139 59.0299 134.14C60.1299 131.38 61.8599 128.86 62.9099 126.08C63.8999 123.48 65.2499 123.13 67.8499 123.76C77.6499 126.14 87.6199 126.46 97.5799 125.11C108.43 123.64 108.42 123.5 113.13 133.61C116.06 139.88 117.79 140.92 124.77 140.35C126.75 140.19 128.72 139.81 130.66 139.37C144.42 136.22 155.53 128.95 164.77 118.31C171.64 110.4 173.63 101.49 172.34 93.29V93.28ZM152.9 108.02C146.17 115.53 138.47 121.13 128.64 123.82C124.83 124.86 125.04 121.81 124.08 120.08C122.56 117.35 125.33 117.76 126.55 117.24C132.18 114.87 134.41 111.16 132.85 106.55C131.3 101.96 126.77 100.36 120.79 102.55C114.55 104.84 108.22 106.77 101.77 108.4C84.8299 112.68 68.8099 108.75 52.9599 103.13C52.1799 102.85 51.4099 102.54 50.6299 102.27C45.4999 100.53 41.0299 102.26 39.5099 106.56C38.0499 110.7 40.1099 115.14 45.0399 116.74C48.7499 117.94 49.1399 119.36 47.3199 122.5C46.2899 124.28 45.2899 124.15 43.6699 123.71C32.2099 120.66 23.4099 114.02 16.9299 104.18C16.1799 103.04 15.7299 101.85 15.6999 100.46C15.2399 80.52 16.7399 60.96 25.7199 42.61C32.0499 29.68 42.5299 21.99 55.7999 17.44C57.9599 16.7 59.1699 17.03 59.9899 19.19C60.6399 20.89 61.5199 22.5 62.3599 24.12C64.5299 28.34 67.9599 30.6 72.7499 30.61C81.7399 30.63 90.7299 30.63 99.7199 30.61C105.75 30.59 109.33 27.05 111.1 21.8C112.74 16.95 115.23 16.88 119.55 18.47C140.8 26.3 149.47 43.48 153.98 63.87C155.78 72.02 156.3 80.33 156.8 88.36C156.7 95.32 158.17 102.12 152.9 108V108.02Z" fill="#D7BD92"/>
                                <path d="M109.73 54.36C118.39 54.37 125.29 61.15 125.38 69.73C125.47 78.71 118.75 85.52 109.76 85.57C100.96 85.61 93.9599 78.54 94.0899 69.74C94.2199 61.14 101.13 54.35 109.73 54.36Z" fill="#D7BD92"/>
                                <path d="M78.31 69.95C78.35 78.82 71.46 85.6 62.46 85.56C53.8 85.52 47.04 78.72 47.03 70.03C47.03 61.4 53.81 54.47 62.37 54.36C71.26 54.25 78.27 61.11 78.31 69.95Z" fill="#D7BD92"/>
                            </g>
                        </svg>
                        Login With Discord
                    </div>
                );
            case "email":
                return (
                    <div className="inputs">
                        
                        <input type="email" 
                            placeholder="Enter email used here"
                            value={ email }
                            onChange={(e) => { setEmail(e.target.value) }}
                        />

                        
                        <input type="password" 
                            placeholder="Enter password used here"
                            value={ password }
                            onChange={(e) => { setPassword(e.target.value) }}
                        />

                        <div className="button" onClick={ () => { loginWithEmail() } }>
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="26" viewBox="0 0 25 26" fill="none">
                                <path d="M23.9608 13.024C23.4243 6.66197 18.2609 1.98933 11.9734 2.00002C4.85857 2.01224 -0.73464 8.1238 0.0787489 15.106C0.318436 17.1621 0.446783 19.1967 0.227199 21.2527C0.168437 21.8072 0.108129 22.3693 0.131325 22.9253C0.194726 24.378 1.1612 25.3907 2.62407 25.5572C3.02767 25.6031 3.44365 25.5618 3.85343 25.542C5.8266 25.4457 7.79358 25.1326 9.77139 25.5297C11.2729 25.8307 12.7806 25.8001 14.2899 25.5114C20.2558 24.3704 24.4619 18.9951 23.9593 13.024H23.9608ZM21.5609 14.7715C21.1681 20.0933 15.9831 24.1153 10.5477 23.2263C8.25594 22.852 5.99515 23.0048 3.71426 23.182C2.52046 23.2736 2.48026 23.24 2.5684 22.0806C2.75551 19.6488 2.73077 17.2461 2.46634 14.799C1.84934 9.10293 6.31216 4.38598 12.0507 4.39668C17.6811 4.4089 21.98 9.09682 21.5624 14.77L21.5609 14.7715Z" fill="#737373"/>
                                <path d="M12.0322 15.0633C11.3765 15.0847 10.8028 14.5454 10.7796 13.8871C10.7595 13.2944 11.3038 12.7185 11.9193 12.6788C12.5656 12.6376 13.1749 13.1753 13.2074 13.8153C13.2414 14.4523 12.6847 15.0419 12.0306 15.0633H12.0322Z" fill="#737373"/>
                                <path d="M18.0073 13.9451C17.9687 14.5897 17.3517 15.1167 16.7068 15.0556C16.0836 14.9976 15.561 14.4232 15.5873 13.8244C15.6166 13.1646 16.2012 12.6391 16.8599 12.6773C17.5249 12.717 18.0475 13.2929 18.0073 13.9436V13.9451Z" fill="#737373"/>
                                <path d="M7.1549 15.0617C6.50388 15.0449 5.93637 14.4492 5.97039 13.8199C6.00441 13.2028 6.55801 12.6819 7.1812 12.6773C7.82912 12.6727 8.41519 13.2486 8.40437 13.8795C8.39354 14.5271 7.81211 15.0785 7.1549 15.0617Z" fill="#737373"/>
                                <circle cx="19" cy="6" r="5" fill="#5E7647" stroke="#737373" stroke-width="2"/>
                            </svg>

                            Login with Email
                        </div>

                    </div>
                )

        }

    }
    
    return (
        <>
        
            <div className="login-container">

                <div className="items">
                    <div className="header">
                        <Image src="https://cdn.sideforge.io/Sentinel/Primary%20Logomark%20-%20Housed.png" alt="logo" width="75" height="75" />
                        <h1>Welcome to Sentinel!</h1>
                        <p>In order to access the game dashboard, please login with your { provider } so we can verify your identity.</p>
                    </div>

                    { loading ? <p>Loading your authorization...</p> : <></> }

                    { errorMessage && !loading ? <p>Error: { errorMessage } </p> :
                     formatSignInByProvider() }
                </div>
            </div>

        </>
    )
}
