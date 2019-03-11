import React from 'react'
import { Redirect } from 'react-router'

import ChannelsPage from '../components/pages/ChannelsPage'

const routes = [
    {
        path: '/',
        render: () => <Redirect to="/channels" />,
    },
    {
        component: ChannelsPage,
        path: '/channels',
        title: "Youtube channels example",
    },
]

export default routes
