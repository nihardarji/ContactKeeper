import React, { useContext, useEffect } from 'react'
import { Contacts } from '../contacts/Contacts'
import { ContactFrom } from '../contacts/ContactFrom'
import { ContactFilter } from '../contacts/ContactFilter'
import AuthContext from '../../context/auth/authContext'


export const Home = () => {
    const authContext = useContext(AuthContext)

    useEffect(() => {
        authContext.loadUser()
        // eslint-disable-next-line
    }, [])
    
    return (
       <div className="grid-2">
            <div>
                <ContactFrom />
            </div>
            <div>
                <ContactFilter />
                <Contacts />
            </div>
       </div>
    )
}
