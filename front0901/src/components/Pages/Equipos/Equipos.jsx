import React, { useState, useEffect } from 'react'
import { TextField, Dialog, DialogTitle, DialogContent, DialogActions, Container, Typography, Grid, Box, Button, Stack, Avatar, IconButton, Divider } from '@mui/material'
import ApiRequest from '../../../helpers/axiosInstances'
import { AddOutlined, EditOutlined, DeleteOutline, AlignHorizontalCenter, ListAltOutlined } from '@mui/icons-material'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import Page from '../../common/Page'
import ToastAutoHide from '../../common/ToastAutoHide'
import CommonTable from '../../common/CommonTable'
import Select from '@mui/material/Select';


const Equipos = () => {
	
    const initialState = {       
		nombreEq:"",
        delegado:"",
        celular:"",
        idCategoria:""
	}

	const [equiposList, setEquiposList] = useState([])
	const [body, setBody] = useState(initialState)
	const [openDialog, setOpenDialog] = useState(false)
	const [isEdit, setIsEdit] = useState(false)
	const [mensaje, setMensaje] = useState({ ident: null, message: null, type: null })
    const [departamento, setDepartamento] = useState([])
	
    const init = async () => {
		const { data } = await ApiRequest().get('/equipos')        
		setEquiposList(data)
	}

    const peticionselect = async () =>{
        const {data} = await ApiRequest().get('/eqCategoria')
        setDepartamento(data)
    }
    useEffect(peticionselect, [] )

	const columnas = [		
		{field: 'id', headerName: 'ID', width: 50, headerAlign: 'center',align: 'center'},
        {field: 'nombreEq', headerName: 'Nombre', width: 160, resizable: true},
		{ field: 'delegado', headerName: 'Delegado', width: 150 },
		{ field: 'celular', headerName: 'Celular', width: 150 },
        { field: 'Categoria', headerName: 'Categoria', width: 150 },
        { field: '', headerName: 'idCategoria', width: 100 },
		{ field: '',
			headerName: 'Acciones', width: 200,
            headerAlign: 'center',align: 'center',
			renderCell: (params) => (
				<Stack  direction='row' divider={<Divider orientation="vertical" flexItem />} justifyContent="center" alignItems="center" spacing={2}>
					<IconButton size='small' onClick={() => {
						setIsEdit(true)
						setBody(params.row)
						handleDialog()
                        peticionselect()
                       console.log(body)
					}}>
						<EditOutlined />
					</IconButton>
					<IconButton size='small' onClick={() => onDelete(params.id)}>
						<ListAltOutlined />
					</IconButton>
				</Stack>
			)},
		{field: "Jugadores", headerName:'Jugadores', width:100, renderCell: (params) => (
		<Stack>	
			<IconButton size='small' onClick={() => {
				setIsEdit(true)
				setBody(params.row)
				handleDialog()
				peticionselect()
			console.log(body)
		}}>
		<FormatListNumberedIcon />
		 </IconButton>
		</Stack>)}
	]

	const onDelete = async (id) => {
		try {
			const { data } = await ApiRequest().post('/eliminarEquipo', { id: id })
			setMensaje({
				ident: new Date().getTime(),
				message: data.message,
				type: 'success'
			})
			init()
		} catch ({ response }) {
			setMensaje({
				ident: new Date().getTime(),
				message: response.data.sqlMessage,
				type: 'error'
			})
		}
	}

	const handleDialog = () => {
		setOpenDialog(prev => !prev)
	}

	const onChange = ({ target }) => {
		const { name, value } = target
		setBody({
			...body,
			[name]: value            
		})
        console.log(body)
	}

	const onSubmit = async () => {
		try {
			const { data } = await ApiRequest().post('/guardarEquipo', body)
			handleDialog()
			setBody(initialState)
			setMensaje({
				ident: new Date().getTime(),
				message: data.message,
				type: 'success'
			})
			init()
			setIsEdit(false)
		} catch ({ response }) {
			setMensaje({
				ident: new Date().getTime(),
				message: response.data.sqlMessage,
				type: 'error'
			})
		}
	}

	const onEdit = async () => {
		try {
			const { data } = await ApiRequest().post('/editarEq', body)
			handleDialog()
			setBody(initialState)
			setMensaje({
				ident: new Date().getTime(),
				message: data.message,
				type: 'success'
			})
			init()
		} catch ({ response }) {
			setMensaje({
				ident: new Date().getTime(),
				message: response.data.sqlMessage,
				type: 'error'
			})
		}
	}

	useEffect(init, [])

	return (
		<>
			<Dialog maxWidth='xs' open={openDialog} onClose={handleDialog} fullWidth>
				<DialogTitle>
					{isEdit ? 'Editar Equipo' : 'Crear Equipo'}
				</DialogTitle>
				<DialogContent>				
                	<Grid container spacing={2}>						
						<Grid item xs={12} sm={10}>
							<TextField
								margin='normal'
								name='nombreEq'
								value={body.nombreEq}
								onChange={onChange}
								variant='outlined'
								size='small'
								color='primary'
								fullWidth
								label='Nombre Equipo'
							/>
						</Grid>
						<Grid item xs={12} sm={10}>
							<TextField
								margin='normal'
								name='delegado'
								value={body.delegado}
								onChange={onChange}
								variant='outlined'
								size='small'
								color='primary'
								fullWidth
								label='Delegado'
							/>
						</Grid>
                        <Grid item xs={12} sm={10}>
                        <TextField
								margin='normal'
								name='celular'
								value={body.celular}
								onChange={onChange}
								variant='outlined'
								size='small'
								color='primary'
								fullWidth
								label='Celular'
							/>
						</Grid>
                        <Grid item xs={12} sm={12}  >
                        
                        <label htmlFor="comboCategorias" >
                        Elige la Categoria :  
                            </label>                            
                        <select  id= "comboCategorias"  
                                    name="idCategoria"                                    
                                    onChange={onChange}
                                     >
                            {departamento.map((dpto) => {
                            return (
                                <option key={dpto.idCategorias} value={dpto.idCategorias} >
                                {dpto.nombreCat}
                                </option>
                            );
                            })}
                        </select>                         
                        
						</Grid>
					</Grid>

				</DialogContent>
				<DialogActions>
					<Button variant='contained' color='secondary' onClick={handleDialog}>cancelar</Button>
					<Button variant='contained' disabled={false} color='primary' onClick={isEdit ? () => onEdit() : () => onSubmit()}>guardar</Button>
				</DialogActions>
			</Dialog>
			
			<Page title="Liga | Equipos">
				<ToastAutoHide message={mensaje} />
				<Container maxWidth='lg'>
					<Box sx={{ pb: 6 }}>
						<Typography variant="h5">Lista de Equipos</Typography>
					</Box>
					
                    <Grid container spacing={2}>
						<Grid item xs={12} sm={4}>
							<Button onClick={handleDialog} startIcon={<AddOutlined />} variant='contained' color='primary'>Nuevo</Button>
						</Grid>
						<Grid item xs={12} sm={8} />
						<Grid item  md={12} sm={12} >                    
                            <CommonTable data={equiposList} columns={columnas}  />
						</Grid>
					</Grid>
				</Container>
			</Page>
		</>
	)
}

export default Equipos

