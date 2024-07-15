import { Injectable } from '@angular/core';

export interface IRECOSUP_U_ActualizarMatriz { // Update MAtriz proyecto evaluacion
	anio: number
	mesEvaluado: any
	tipoEvaluado: any
	cantidad: number
	personas: number
	estado: number
	codigo_reverso: number
	status: number
	id?: number
}

export interface IRECOSUP_I_EvaluacionMovimientos { // Update MAtriz proyecto evaluacion
	mes: string,
	anio: string,
	codigo: string,
	estado: string,
	valor: number,
	status: number,
	id?: number
}

export interface IPie { // Pie de tabla 
	a: number
	b: number
	c: number
	d: number
	e: number
	f: number
	g: number
	h: number
	i: number
	total: number
}


export interface IEmpresa {
	UsuarioId?: number
	RazonSocial?: string
	Direccion?: string
	Rif?: string
	Telefono?: string
	Fax?: string
	CorreoElectronico?: string
	PaginaWeb?: string
	Ciudad?: string
	sucursal: number
	grupo_economico: number
	campo_sujeto: number
	ParroquiaId?: number
	ActividadEconomicaId?: number
	DocumentoFecha?: any
	DocumentoFolio?: string
	DocumentoTomo?: string
	DocumentoProtocolo?: string
	CodigoIvss?: string
	FechaInicioFiscal?: any
	FechaCierreFiscal?: any
	NotariaId?: number
	CantidadEmpleados?: number
	EstatusEmpresa?: string
	UsuarioAprobo?: number
	FechaAprobo?: any
	UsuarioCreo?: number
	FechaCreo?: any
	UsuarioModifico?: number
	FechaModifico?: any
}

export interface IEmpresaContactos {
	TipoContactoId?: number
	EmpresaId?: string
	CedulaContacto?: string
	Nombre?: string
	Apellido?: string
	Telefono?: string
	Celular?: string
	Fax?: string
	CorreoElectronico?: string
	Estatus?: string
	UsuarioCreo?: string
	FechaCreo?: any
	UsuarioModifico?: string
	FechaModifico?: any
}


export interface IUsuariosSistema {
	Codigo: string
	Clave: string
	Nombres: string
	Apellidos: string
	Cedula: string
	FechaNacimiento: any
	TelefonoLocal: string
	TelefonoCelular: string
	CorreoPrincipal: string
	CorreoSecundario: string
	Cargo: string
	EsAdministrador: number
	Estatus: number
	SuspencionId: string
	SuspencionDescripcion: string
	UsuarioCreo: number
	FechaCreo: any
	UsuarioModifico: number
	FechaModifico: any
}

export interface ICrearCertificados {
	usuario: number
	token: string
	type: number
	created_user: number
}

export interface IDeclararUtilidad {
	EmpresaId: number
	EmpresaGananciaId: string
	Fecha: any
	FechaDesde: any
	FechaHasta: any
	Monto: string
	DeclaraPerdida: string
	DeclaraTrabajadores: string
	Articulo: string
	EstatusGeneralId: string
	UsuarioCreo: number
	FechaCreo: string
	UsuarioModifico: number
	FechaModifico: string
	ejercicioFiscal: string
	Diferencia: number
	TipoAporte: any
}


export interface RECOSUP_U_PagarAportesConciliar {
	EstatusGeneralId: number
	Observacion: string
	EmpresaGananciaId: number
}

export interface RECOSUP_U_AprobarGanancias {
	EstatusGeneralId: number
	EmpresaGananciaId: number
}



export interface IActualizarDatosEmpresa {
	UsuarioId: number
	RazonSocial: string
	Direccion: string
	Telefono: string
	Fax: string
	ParroquiaId: undefined
	CantidadEmpleados: string
	ActividadEconomicaId: any
	CorreoElectronico: string
	Ciudad: string
	Estado: string
	Municipio: string
	sucursal?: any
	grupo_economico?: any
	campo_sujeto?: any
	cese_funcion?: any
	empresa_fusionada?: any
}

export interface RECOSUP_U_Usuarios {
	Codigo: string
	Nombres: string
	Apellidos: string
	Cedula: string
	FechaModifico: string
	TelefonoLocal: string
	TelefonoCelular: string
	CorreoPrincipal: string
	CorreoSecundario: string
	Cargo: string
	UsuarioId: number
}

export interface IDataEmpresaCompleta {
	UsuarioId?: number;
	RazonSocial: string;
	Rif: string;
	Email: string;
	SitioWeb: string;
	Telefonos: string;
	FaxEmpresa: string;
	sucursal?: number
	cese_funcion?: number
	empresa_fusionada?: number
	grupo_economico?: number
	campo_sujeto?: number
	ActividadEconomica: string;
	estado: string;
	ciudad: string;
	municipio: string;
	parroquia: string;
	Direccion: string;
	FechaCierreFiscal: string;
	CantidadEmpleados: string;
	FechaRegistro: string;
	FechaAprobacion: string;
	RegistroMercantil: string;
	DocumentoFecha: string;
	DocumentoFolio: string;
	DocumentoProtocolo: string;
	DocumentoTomo: string;
	CodigoIvss: string;
	CedulaContacto: string;
	nombre: string;
	apellido: string;
	telefonoContacto: string;
	celularContacto: string;
	CorreoElectronico: string;
	TipoContacto: string;
	Usuario: string;
	Cedula: string;
	Nombres: string;
	Apellidos: string;
	TelefonoLocal: string;
	TelefonoCelular: string;
	CorreoPrincipal: string;
	CorreoSecundario: string;
	Cargo: string;
}

export interface IRECOSUP_C_Proyectos {
	id_proyectos?: any
	id_empresa: number
	id_analista: number
	nombre_empresa: string
	rif_empresa: string
	observacion?: string
	status_proyecto: number
	nombre_proyecto: string
	ambito_proyecto?: number
	nombre_representante?: string
	telefono_representante?: string
	email_representante?: string
	detalle_financiamiento?: string
	monto_financiamiento?: string
	fecha_proyecto: string
	monto_inversion: string
	direccion: string
	estado: any
	parroquia: any
	municipio: any
	area_proyecto?: number
	beneficiario_directos?: string
	beneficiario_indirectos?: string
	tiempo_ejecucion_desde: string
	tiempo_ejecucion_hasta: string
	UsuarioCreo: number
	UsuarioModifico: number
	Asesor_Nombre?: string
	Asesor_Rif?: string
	Asesor_Telefono?: string
	Asesor_Correo?: string
	Asesor_Representante?: string

}



export interface RECOSUP_U_EmpresasAportes { // Actualizar aportes
	EmpresaId: any
	EmpresaGananciaId: any
	TipoAporteCuentaId: any
	CanalPago: string
	FechaAporte: string
	FechaDesde: string
	FechaHasta: string
	FechaDocumento: string
	ReferenciaBancaria: string
	TipoPagoId: any
	Articulo: any
	Monto: string
	FechaBancoPago: string
	Observacion: string
	EstatusGeneralId: any
	UsuarioModifico: any
	EmpresaAporteId: any
}


export interface RECOSUP_C_MultasNuevasMIF { // crear multas
	id_EmpresaId: any
	status_mif: any
	Monto_mif: string
	Nomenclatura_mif: string
	TipoMultaId: any
	Cuenta_mif: string
	UsuarioCreo: any
	articulo: any
	anio: any
	notificacion: any
	inicio_fiscal: any
	cierre_fiscal: any
	monto_declaracion_definitiva: string
}


export interface RECOSUP_U_UsuariosStatus { // actualizar datos del usuario
	Nombres: string
	Apellidos: string
	Codigo: string
	Cedula: string
	CorreoPrincipal: string
	CorreoSecundario: string
	Cargo: string
	EsAdministrador: number
	Estatus: number
	UsuarioModifico: number
	UsuarioId: number
}


export interface RecursosJerarquicos {
	id_rj?: number
	nombre_empresa: string
	rif: string
	nomenclatura: string
	fecha_interposicion: Date
	fecha_notificacion: Date
	tipo_acto: any
	status: number
	fecha_registro: Date
	observacion: string
	lapso_aprobatorio: number
	lapso_aprobatorio_fecha_desde: string
	lapso_aprobatorio_fecha_hasta: string
	user_created: number
}


export interface RECOSUP_U_ProyectosUpdate {  // Actualizar datos del proyectos
	observacion: string;
	id_empresa: number
	id_analista: number
	nombre_empresa: string
	rif_empresa: string
	status_proyecto: number
	nombre_proyecto: string
	ambito_proyecto: number
	fecha_proyecto: string
	monto_inversion: any
	direccion: string
	estado: number
	parroquia: number
	municipio: number
	area_proyecto: number
	beneficiario_directos: string
	beneficiario_indirectos: string
	tiempo_ejecucion_desde: string
	tiempo_ejecucion_hasta: string
	UsuarioModifico: number
	id_proyectos: number
}

export interface RECOSUP_U_PasswordUsersID { // Cambiar clave de usuario segun ID
	Clave: string
	UsuarioModifico: number
	FechaModifico: string
	UsuarioId: number
	Codigo: string
}

export interface RECOSUP_U_PagarMultas { // pagar multas
	banco: number
	referencia: string
	montoPagado: string
	fechaPago: string
	UsuarioModifico: number
	id_mif: number,
	status_mif: any
	Bauche: any,
	Observacion: any,
	PG_Banco?: string
}


export interface RECOSUP_C_UsuarioAdmin {
	Codigo: string
	Clave: string
	Nombres: string
	Apellidos: string
	Cedula: string
	TelefonoLocal: string
	TelefonoCelular: string
	CorreoPrincipal: string
	CorreoSecundario: string
	Cargo: string
	EsAdministrador: any
	Estatus: any
	UsuarioCreo: number
}

export interface RECOSUP_U_UsuarioAdmim {
	Codigo: string
	Clave: string
	Nombres: string
	Apellidos: string
	Cedula: string
	TelefonoLocal: string
	TelefonoCelular: string
	CorreoPrincipal: string
	CorreoSecundario: string
	Cargo: string
	EsAdministrador: any
	Estatus: any
	UsuarioModifico: number
	UsuarioId: number
}

export interface RECOSUP_C_MultasNuevasMIFNoInscritas {
	Rif: string
	NombreEmpresa: string
	status_mif: number
	Monto_mif: string
	Nomenclatura_mif: string
	TipoMultaId: number
	articulo: number
	anio: number
	notificacion: string
	inicio_fiscal: string
	cierre_fiscal: string
	Cuenta_mif: string
	banco: number
	referencia: string
	montoPagado: string
	fechaPago: string
	UsuarioCreo: number
	FechaCreo: string
	UsuarioModifico: number
	FechaModifico: string
}

export interface RECOSUP_U_PagarMultasEmpresasNoInscritas {
	banco: number
	referencia: string
	status_mif: number
	montoPagado: string
	Bauche: string
	Observacion: string
	fechaPago: string
	UsuarioModifico: number
	id_mif_no_inscri: number
}


// Registrar Enseñar al CHATBOOT
export interface RECOSUP_C_AsistenteVirtual {
	id: number
	idio: string
	tipo: string
	clas: string
	preg: string
	resp: string
	obse: string
}

export interface RECOSUP_U_AsistenteVirtual {
	idio: string
	tipo: string
	clas: string
	preg: string
	resp: string
	obse: string
	id: number
}


export interface RECOSUP_U_RepresentanteLegal {
	TipoContactoId: number
	EmpresaId: number
	Cedula: string
	Nombre: string
	Apellido: string
	Telefono: string
	Celular: string
	Fax: string
	CorreoElectronico: string
	Estatus: number
	UsuarioModifico: number
	FechaModifico: string
	ContactoId: number
}

export interface RECOSUP_U_LegalFinanciero {
	EmpresaId?: any
	DocumentoFolio: any
	DocumentoTomo: any
	DocumentoProtocolo: any
	CodigoIvss: any
	NotariaId: any
	DocumentoFecha: any
	FechaInicioFiscal?: any
	FechaCierreFiscal: any
}


export interface RECOSUP_U_FizcalizarEmpresa {
	status_bloqueo: number
	EmpresaId: number
}


@Injectable({
	providedIn: 'root'
})
export class EmpresaService {

	constructor() { }
}
