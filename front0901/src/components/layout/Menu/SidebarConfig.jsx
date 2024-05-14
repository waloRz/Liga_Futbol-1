import React from 'react'
import { PersonOutlined, HomeOutlined } from '@mui/icons-material'
import GroupOutlinedIcon from '@material-ui/icons/GroupOutlined'


const sidebarConfig = [
	{
		title: 'inicio',
		path: '/app',
		icon: <HomeOutlined />
	},
	{
		title: 'usuarios',
		path: '/app/usuarios',
		icon: <PersonOutlined />
	},
	{
		title: 'equipos',
		path: '/app/equipos',
		icon: < GroupOutlinedIcon/>
	}

]

export default sidebarConfig