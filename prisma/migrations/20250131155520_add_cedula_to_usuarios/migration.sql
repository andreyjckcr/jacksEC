BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[detalle_pedido_ec] (
    [id] INT NOT NULL IDENTITY(1,1),
    [id_pedido] INT NOT NULL,
    [id_producto] VARCHAR(20) NOT NULL,
    [cantidad] INT NOT NULL,
    [precio] DECIMAL(10,2) NOT NULL,
    [subtotal] DECIMAL(21,2),
    CONSTRAINT [PK__detalle___3213E83F86C2F2BE] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[facturacion_ec] (
    [id] INT NOT NULL IDENTITY(1,1),
    [id_pedido] INT NOT NULL,
    [total] DECIMAL(10,2) NOT NULL,
    [fecha] DATETIME CONSTRAINT [DF__facturaci__fecha__0A338187] DEFAULT CURRENT_TIMESTAMP,
    [estado] VARCHAR(20) NOT NULL,
    CONSTRAINT [PK__facturac__3213E83F36BDA6DE] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[pedidos_ec] (
    [id] INT NOT NULL IDENTITY(1,1),
    [id_usuario] INT NOT NULL,
    [fecha] DATETIME CONSTRAINT [DF__pedidos__fecha__056ECC6A] DEFAULT CURRENT_TIMESTAMP,
    [estado] VARCHAR(20) NOT NULL,
    [id_factura] INT,
    CONSTRAINT [PK__pedidos__3213E83F7DADC7EE] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[usuarios_ecommerce] (
    [id] INT NOT NULL IDENTITY(1,1),
    [codigo_empleado] VARCHAR(10) NOT NULL,
    [nombre] VARCHAR(100) NOT NULL,
    [correo] VARCHAR(100) NOT NULL,
    [telefono] VARCHAR(20),
    [direccion] VARCHAR(255),
    [fecha_registro] DATETIME CONSTRAINT [DF__usuarios___fecha__762C88DA] DEFAULT CURRENT_TIMESTAMP,
    [estado] VARCHAR(20) CONSTRAINT [DF__usuarios___estad__7720AD13] DEFAULT 'Activo',
    [cedula] VARCHAR(20) NOT NULL,
    CONSTRAINT [PK__usuarios__3213E83F909A309B] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [UQ__usuarios__CDEF1DDF1D3742AB] UNIQUE NONCLUSTERED ([codigo_empleado]),
    CONSTRAINT [UQ__usuarios__2A586E0B5332DF0B] UNIQUE NONCLUSTERED ([correo])
);

-- CreateTable
CREATE TABLE [dbo].[Ausente] (
    [codigo] CHAR(4),
    [Fecha] DATETIME
);

-- CreateTable
CREATE TABLE [dbo].[Bitacora] (
    [id] INT NOT NULL IDENTITY(1,1),
    [usuario] CHAR(50),
    [fecha] DATETIME
);

-- CreateTable
CREATE TABLE [dbo].[Boleta] (
    [CANTIDAD] DECIMAL(10,2) NOT NULL,
    [ARTICULO] CHAR(50) NOT NULL,
    [PESO] CHAR(10) NOT NULL,
    [EMBALAJE] CHAR(10) NOT NULL,
    [PRECIO] DECIMAL(10,2) NOT NULL,
    [TOTAL] DECIMAL(18,0),
    [CODIGO] CHAR(4) NOT NULL,
    [COD_ART] CHAR(7) NOT NULL,
    [CONSECUTIVO] DECIMAL(18,0) NOT NULL,
    [FECHA] CHAR(10) NOT NULL,
    [NOMBRE] CHAR(60) NOT NULL,
    [SECCION] CHAR(30) NOT NULL,
    [EXISTENCIA] DECIMAL(10,2) NOT NULL
);

-- CreateTable
CREATE TABLE [dbo].[Boleta2] (
    [CANTIDAD] DECIMAL(10,2) NOT NULL,
    [ARTICULO] CHAR(50) NOT NULL,
    [PESO] CHAR(10) NOT NULL,
    [EMBALAJE] CHAR(10) NOT NULL,
    [PRECIO] DECIMAL(10,2) NOT NULL,
    [TOTAL] DECIMAL(10,2) NOT NULL,
    [CODIGO] CHAR(4) NOT NULL,
    [COD_ART] CHAR(7) NOT NULL,
    [CONSECUTIVO] DECIMAL(18,0) NOT NULL,
    [FECHA] CHAR(10) NOT NULL,
    [NOMBRE] CHAR(60) NOT NULL,
    [SECCION] CHAR(30) NOT NULL,
    [EXISTENCIA] DECIMAL(10,2) NOT NULL,
    [ESTADO] CHAR(1),
    [IMPUESTO] DECIMAL(10,2) NOT NULL
);

-- CreateTable
CREATE TABLE [dbo].[BoletaBAK] (
    [CANTIDAD] DECIMAL(10,2) NOT NULL,
    [ARTICULO] CHAR(50) NOT NULL,
    [PESO] CHAR(10) NOT NULL,
    [EMBALAJE] CHAR(10) NOT NULL,
    [PRECIO] DECIMAL(10,2) NOT NULL,
    [TOTAL] DECIMAL(18,0),
    [CODIGO] CHAR(4) NOT NULL,
    [COD_ART] CHAR(7) NOT NULL,
    [CONSECUTIVO] DECIMAL(18,0) NOT NULL,
    [FECHA] CHAR(10) NOT NULL,
    [NOMBRE] CHAR(60) NOT NULL,
    [SECCION] CHAR(30) NOT NULL,
    [EXISTENCIA] DECIMAL(10,2) NOT NULL
);

-- CreateTable
CREATE TABLE [dbo].[CicloMensual] (
    [Ciclo] DECIMAL(10,0) NOT NULL,
    [Periodo] CHAR(8) NOT NULL,
    [FechaInicial] DATETIME NOT NULL,
    [FechaFinal] DATETIME NOT NULL,
    [Estado] CHAR(1) NOT NULL,
    [FechaActual] DATETIME NOT NULL,
    [Descripcion] CHAR(50),
    CONSTRAINT [PK_CicloM] PRIMARY KEY CLUSTERED ([Ciclo])
);

-- CreateTable
CREATE TABLE [dbo].[Ciclos] (
    [Ciclo] DECIMAL(10,0) NOT NULL,
    [Periodo] CHAR(8) NOT NULL,
    [FechaInicial] DATETIME NOT NULL,
    [FechaFinal] DATETIME NOT NULL,
    [Estado] CHAR(1) NOT NULL,
    [FechaActual] DATETIME NOT NULL,
    [Descripcion] CHAR(50),
    CONSTRAINT [PK_Ciclos] PRIMARY KEY CLUSTERED ([Ciclo])
);

-- CreateTable
CREATE TABLE [dbo].[Departamento] (
    [Id] INT NOT NULL,
    [Page] NVARCHAR(50),
    [Page_size] NVARCHAR(50),
    [Dept_code] NVARCHAR(50),
    [Dept_name] NVARCHAR(50),
    [Dept_code_icontains] NVARCHAR(50),
    [Dept_name_icontains] NVARCHAR(50),
    [Ordering] NVARCHAR(50),
    CONSTRAINT [PK_Departamento] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[Departamentos] (
    [Departamento_Codigo] CHAR(3) NOT NULL,
    [Departamento_Nombre] CHAR(30) NOT NULL
);

-- CreateTable
CREATE TABLE [dbo].[Detalle] (
    [Empleado_Codigo] CHAR(4) NOT NULL,
    [Fecha] DATETIME NOT NULL,
    [Codigo_Producto] CHAR(7) NOT NULL,
    [Cantidad] DECIMAL(5,2) NOT NULL,
    [Precio] DECIMAL(10,2) NOT NULL,
    [factura] DECIMAL(10,0) NOT NULL,
    [impuesto] DECIMAL(10,2) NOT NULL,
    [total] DECIMAL(10,2) NOT NULL
);

-- CreateTable
CREATE TABLE [dbo].[Detalle_Horarios] (
    [Cod_Horario] INT NOT NULL,
    [Dia] DECIMAL(1,0) NOT NULL,
    [Rebaja] DECIMAL(1,0) NOT NULL,
    [Entrada] DATETIME NOT NULL,
    [SalidaIntermedia] DATETIME NOT NULL,
    [EntradaIntermedia] DATETIME,
    [Salida] DATETIME NOT NULL,
    [HorasLaboradas] DECIMAL(4,2) NOT NULL,
    [Inicio] DATETIME,
    [Fin] DATETIME
);

-- CreateTable
CREATE TABLE [dbo].[Diario_Marcas] (
    [Codigo] CHAR(4) NOT NULL,
    [Fecha] DATETIME NOT NULL,
    [Hora] DATETIME NOT NULL,
    [Funcion] CHAR(3) NOT NULL,
    CONSTRAINT [PK_Diario_Marcas] PRIMARY KEY CLUSTERED ([Codigo],[Fecha],[Hora])
);

-- CreateTable
CREATE TABLE [dbo].[Diario_Marcas_Mensual] (
    [Codigo] CHAR(4) NOT NULL,
    [Fecha] DATETIME NOT NULL,
    [Hora] DATETIME NOT NULL,
    [Funcion] CHAR(3) NOT NULL,
    CONSTRAINT [PK_Diario_Marcas1] PRIMARY KEY CLUSTERED ([Codigo],[Fecha],[Hora])
);

-- CreateTable
CREATE TABLE [dbo].[Dimension] (
    [CODDIM] VARCHAR(30) NOT NULL,
    [DESCRIPCION] VARCHAR(100) NOT NULL,
    CONSTRAINT [PK_Dimension] PRIMARY KEY CLUSTERED ([CODDIM])
);

-- CreateTable
CREATE TABLE [dbo].[Empleado] (
    [Id] INT NOT NULL,
    [FirstName] NVARCHAR(100),
    [EmpCode] NVARCHAR(50),
    [LastName] NVARCHAR(100),
    [Nickname] NVARCHAR(100),
    [DevicePassword] NVARCHAR(100),
    [CardNo] NVARCHAR(50),
    [DepartmentId] INT,
    [Position] NVARCHAR(100),
    [HireDate] NVARCHAR(50),
    [Gender] NVARCHAR(10),
    [Birthday] NVARCHAR(50),
    [VerifyMode] INT,
    [EmployeeType] NVARCHAR(50),
    [ContactTel] NVARCHAR(20),
    [OfficeTel] NVARCHAR(20),
    [Mobile] NVARCHAR(20),
    [National] NVARCHAR(50),
    [City] NVARCHAR(50),
    [Address] NVARCHAR(200),
    [Postcode] NVARCHAR(20),
    [Email] NVARCHAR(100),
    [EnrollSn] NVARCHAR(50),
    [SSN] NVARCHAR(20),
    [Religion] NVARCHAR(50),
    [EnableAttendance] BIT,
    [EnableOvertime] BIT,
    [EnableHoliday] BIT,
    [DevicePrivilege] INT,
    [UpdateTime] NVARCHAR(50),
    [Fingerprint] NVARCHAR(50),
    [Face] NVARCHAR(50),
    [Palm] NVARCHAR(50),
    [VLFace] NVARCHAR(50),
    CONSTRAINT [PK__Empleado__3214EC07FBE1617E] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[empleadosDYN365] (
    [Codigo_del_empleado] VARCHAR(4) NOT NULL,
    [Nombre] VARCHAR(50),
    [Fecha_de_Nacimiento] DATE,
    [Codigo_de_nomina] VARCHAR(10),
    [Codigo_Departamento] INT,
    [Descripcion_del_departamento] VARCHAR(50),
    [Correo_electronico] VARCHAR(100),
    [Phone] VARCHAR(15),
    [Direccion] VARCHAR(300),
    [Nomina_6] DECIMAL(15,2),
    [Nombre2] VARCHAR(50),
    [NIF] VARCHAR(15),
    [Fecha_de_nacimiento2] DATE,
    [Seccion] INT,
    [DepConcat] VARCHAR(30),
    CONSTRAINT [PK__empleado__3DD7451C9096AC77] PRIMARY KEY CLUSTERED ([Codigo_del_empleado])
);

-- CreateTable
CREATE TABLE [dbo].[EmpleadoTurno] (
    [codigo] CHAR(4) NOT NULL,
    [turno] INT NOT NULL,
    CONSTRAINT [PK_EmpleadoTurno1] PRIMARY KEY CLUSTERED ([codigo],[turno])
);

-- CreateTable
CREATE TABLE [dbo].[Employee] (
    [id] BIGINT,
    [codigo] CHAR(4),
    [Nombre] VARCHAR(100),
    [departamento] VARCHAR(100)
);

-- CreateTable
CREATE TABLE [dbo].[Empresa] (
    [idcia] DECIMAL(2,0) NOT NULL,
    [Descripcion] CHAR(50) NOT NULL,
    [Direccion] CHAR(100) NOT NULL,
    [Telefono] CHAR(20) NOT NULL,
    [Fax] CHAR(20) NOT NULL,
    [Ciclo] DECIMAL(5,0) NOT NULL,
    [Estado] INT NOT NULL,
    CONSTRAINT [PK_Empresa] PRIMARY KEY CLUSTERED ([idcia])
);

-- CreateTable
CREATE TABLE [dbo].[Feriados] (
    [Iddia] DECIMAL(5,0) NOT NULL,
    [Descripcion] CHAR(30) NOT NULL,
    [Fecha] DATETIME NOT NULL,
    CONSTRAINT [PK_Feriados] PRIMARY KEY CLUSTERED ([Iddia])
);

-- CreateTable
CREATE TABLE [dbo].[General] (
    [CIA] CHAR(2) NOT NULL,
    [NOMBRE] CHAR(60) NOT NULL,
    [CTA] CHAR(15) NOT NULL,
    [NPEDIDO] DECIMAL(18,0) NOT NULL,
    [SIGUIENTE] DECIMAL(18,0) NOT NULL,
    [MAXIMP] MONEY NOT NULL,
    [TITULO] CHAR(40) NOT NULL,
    [NACCION] DECIMAL(10,0),
    [CONTROL] CHAR(1)
);

-- CreateTable
CREATE TABLE [dbo].[Grupos] (
    [Cod_Grup] INT NOT NULL,
    [Descripcion] CHAR(35) NOT NULL,
    [Estado] BIT NOT NULL
);

-- CreateTable
CREATE TABLE [dbo].[Historial_Marcas] (
    [Ciclo] DECIMAL(18,0) NOT NULL,
    [Codigo] CHAR(4) NOT NULL,
    [Nombre] CHAR(200),
    [Depto] INT NOT NULL,
    [DptoName] CHAR(100),
    [Fecha] DATETIME NOT NULL,
    [Ord] DECIMAL(10,2) NOT NULL,
    [Ext] DECIMAL(10,2) NOT NULL,
    [Dob] DECIMAL(10,2) NOT NULL,
    [Rep] DECIMAL(10,2) NOT NULL,
    [Estado] BIT,
    [Control] CHAR(1) NOT NULL,
    [Vac] DECIMAL(10,2) NOT NULL,
    [Inc] DECIMAL(10,2),
    [Observaciones] CHAR(100),
    [Entrada1] CHAR(5),
    [Salida1] CHAR(5),
    [Entrada2] CHAR(5),
    [Salida2] CHAR(5),
    [Entrada3] CHAR(5),
    [Salida3] CHAR(5),
    [Totales] DECIMAL(10,2)
);

-- CreateTable
CREATE TABLE [dbo].[homologos] (
    [jacks] CHAR(4),
    [dyn] CHAR(4)
);

-- CreateTable
CREATE TABLE [dbo].[Horarios] (
    [Cod_Horario] INT NOT NULL,
    [Descripcion] CHAR(60) NOT NULL,
    [Tipo] DECIMAL(5,0) NOT NULL,
    [Factor] DECIMAL(5,2) NOT NULL,
    [Tardia] DECIMAL(5,0) NOT NULL,
    [Anticipo] DECIMAL(5,0) NOT NULL,
    [EntAnt] DECIMAL(5,0) NOT NULL,
    [SalDes] DECIMAL(5,0) NOT NULL,
    [MaximoHoras] DECIMAL(18,0) NOT NULL,
    [SabadoExtra] CHAR(1) NOT NULL,
    CONSTRAINT [PK_Horarios2] PRIMARY KEY CLUSTERED ([Cod_Horario])
);

-- CreateTable
CREATE TABLE [dbo].[Incapacidad] (
    [Codigo] CHAR(4),
    [FechaInicial] DATETIME,
    [FechaFinal] DATETIME,
    [Dias] DECIMAL(5,0)
);

-- CreateTable
CREATE TABLE [dbo].[InterfazHoras] (
    [emplId] CHAR(4),
    [payrollhourtableId] CHAR(16),
    [qty] DECIMAL(5,2),
    [dateHour] DATETIME,
    [status] INT,
    [ObsError] VARCHAR(max)
);

-- CreateTable
CREATE TABLE [dbo].[MarcaHst] (
    [Codigo] CHAR(4) NOT NULL,
    [Fecha] DATETIME NOT NULL,
    [Hora] DATETIME NOT NULL,
    [Funcion] CHAR(3) NOT NULL,
    CONSTRAINT [PK_MarcaHst_2111] PRIMARY KEY CLUSTERED ([Codigo],[Fecha],[Hora],[Funcion])
);

-- CreateTable
CREATE TABLE [dbo].[MarcaHstMensual] (
    [Codigo] CHAR(4) NOT NULL,
    [Fecha] DATETIME NOT NULL,
    [Hora] DATETIME NOT NULL,
    [Funcion] CHAR(3) NOT NULL,
    [id_departa] INT NOT NULL,
    CONSTRAINT [PK_MarcaHstmensual_2111] PRIMARY KEY CLUSTERED ([Codigo],[Fecha],[Hora],[Funcion])
);

-- CreateTable
CREATE TABLE [dbo].[Marcas] (
    [Codigo] CHAR(4) NOT NULL,
    [Fecha] DATETIME NOT NULL,
    [Entrada] CHAR(5),
    [Salida] CHAR(5),
    [Ord] DECIMAL(10,2) NOT NULL,
    [Ext] DECIMAL(10,2) NOT NULL,
    [Dob] DECIMAL(10,2) NOT NULL,
    [Rep] DECIMAL(10,2) NOT NULL,
    [Estado] BIT,
    [Control] CHAR(1),
    [Vac] DECIMAL(10,2) NOT NULL,
    [Inc] DECIMAL(10,2) NOT NULL,
    [Observaciones] CHAR(100),
    [Entrada1] CHAR(5),
    [Salida1] CHAR(5),
    [Entrada2] CHAR(5),
    [Salida2] CHAR(5),
    [Entrada3] CHAR(5),
    [Salida3] CHAR(5),
    [Totales] DECIMAL(10,2),
    [Turno] INT,
    CONSTRAINT [PK_Marcas] PRIMARY KEY CLUSTERED ([Codigo],[Fecha])
);

-- CreateTable
CREATE TABLE [dbo].[Marcas_Auditoria] (
    [Codigo] CHAR(4) NOT NULL,
    [Fecha] DATETIME NOT NULL,
    [Entrada] CHAR(5),
    [Salida] CHAR(5),
    [Ord] DECIMAL(10,2) NOT NULL,
    [Ext] DECIMAL(10,2) NOT NULL,
    [Dob] DECIMAL(10,2) NOT NULL,
    [Rep] DECIMAL(10,2) NOT NULL,
    [Estado] BIT,
    [Control] CHAR(1),
    [Vac] DECIMAL(10,2) NOT NULL,
    [Inc] DECIMAL(10,2) NOT NULL,
    [Observaciones] CHAR(100),
    [Entrada1] CHAR(5),
    [Salida1] CHAR(5),
    [Entrada2] CHAR(5),
    [Salida2] CHAR(5),
    [Entrada3] CHAR(5),
    [Salida3] CHAR(5),
    [Totales] DECIMAL(10,2),
    [Turno] INT,
    [Usuario] CHAR(50),
    [Tipo] INT,
    [FechaModificacion] DATETIME NOT NULL,
    [Terminal] CHAR(50)
);

-- CreateTable
CREATE TABLE [dbo].[Marcas_Originales] (
    [Codigo] CHAR(4),
    [Fecha] DATETIME,
    [Indice] INT,
    [Entrada1] CHAR(5),
    [Salida1] CHAR(5),
    [Entrada2] CHAR(5),
    [Salida2] CHAR(5),
    [Entrada3] CHAR(5),
    [Salida3] CHAR(5),
    [Entrada4] CHAR(5),
    [Salida4] CHAR(5)
);

-- CreateTable
CREATE TABLE [dbo].[MarcasMensual] (
    [Codigo] CHAR(4) NOT NULL,
    [Fecha] DATETIME NOT NULL,
    [Entrada] CHAR(5),
    [Salida] CHAR(5),
    [Ord] DECIMAL(10,2) NOT NULL,
    [Ext] DECIMAL(10,2) NOT NULL,
    [Dob] DECIMAL(10,2) NOT NULL,
    [Rep] DECIMAL(10,2) NOT NULL,
    [Estado] BIT,
    [Control] CHAR(1),
    [Vac] DECIMAL(10,2) NOT NULL,
    [Inc] DECIMAL(10,2) NOT NULL,
    [Observaciones] CHAR(100),
    [Entrada1] CHAR(5),
    [Salida1] CHAR(5),
    [Entrada2] CHAR(5),
    [Salida2] CHAR(5),
    [Entrada3] CHAR(5),
    [Salida3] CHAR(5),
    [Totales] DECIMAL(10,2),
    [Turno] INT
);

-- CreateTable
CREATE TABLE [dbo].[MarcasMensual_102024] (
    [Codigo] CHAR(4) NOT NULL,
    [Fecha] DATETIME NOT NULL,
    [Entrada] CHAR(5),
    [Salida] CHAR(5),
    [Ord] DECIMAL(10,2) NOT NULL,
    [Ext] DECIMAL(10,2) NOT NULL,
    [Dob] DECIMAL(10,2) NOT NULL,
    [Rep] DECIMAL(10,2) NOT NULL,
    [Estado] BIT,
    [Control] CHAR(1),
    [Vac] DECIMAL(10,2) NOT NULL,
    [Inc] DECIMAL(10,2) NOT NULL,
    [Observaciones] CHAR(100),
    [Entrada1] CHAR(5),
    [Salida1] CHAR(5),
    [Entrada2] CHAR(5),
    [Salida2] CHAR(5),
    [Entrada3] CHAR(5),
    [Salida3] CHAR(5),
    [Totales] DECIMAL(10,2),
    [Turno] INT
);

-- CreateTable
CREATE TABLE [dbo].[MarcasMensualBAK] (
    [Codigo] CHAR(4) NOT NULL,
    [Fecha] DATETIME NOT NULL,
    [Entrada] CHAR(5),
    [Salida] CHAR(5),
    [Ord] DECIMAL(10,2) NOT NULL,
    [Ext] DECIMAL(10,2) NOT NULL,
    [Dob] DECIMAL(10,2) NOT NULL,
    [Rep] DECIMAL(10,2) NOT NULL,
    [Estado] BIT,
    [Control] CHAR(1),
    [Vac] DECIMAL(10,2) NOT NULL,
    [Inc] DECIMAL(10,2) NOT NULL,
    [Observaciones] CHAR(100),
    [Entrada1] CHAR(5),
    [Salida1] CHAR(5),
    [Entrada2] CHAR(5),
    [Salida2] CHAR(5),
    [Entrada3] CHAR(5),
    [Salida3] CHAR(5),
    [Totales] DECIMAL(10,2),
    [Turno] INT,
    CONSTRAINT [PK_MarcasMensual411236343566145789211] PRIMARY KEY CLUSTERED ([Codigo],[Fecha])
);

-- CreateTable
CREATE TABLE [dbo].[Motivos] (
    [Cod] INT NOT NULL,
    [Descripcion] CHAR(25) NOT NULL,
    [Estado] BIT NOT NULL,
    CONSTRAINT [PK_Motivos] PRIMARY KEY CLUSTERED ([Cod])
);

-- CreateTable
CREATE TABLE [dbo].[Pedido] (
    [Empleado_Codigo] CHAR(4) NOT NULL,
    [Fecha] DATETIME NOT NULL,
    [Monto] DECIMAL(19,4) NOT NULL,
    [Estado] CHAR(1) NOT NULL,
    [Factura] DECIMAL(10,0) NOT NULL,
    [Forma_Pago] CHAR(1) NOT NULL,
    CONSTRAINT [PK_Pedido1] PRIMARY KEY CLUSTERED ([Empleado_Codigo],[Fecha],[Factura])
);

-- CreateTable
CREATE TABLE [dbo].[Permisos] (
    [Codigo] CHAR(4) NOT NULL,
    [Fecha] DATETIME NOT NULL,
    [HoraEntrada] DATETIME NOT NULL,
    [Fecha2] DATETIME NOT NULL,
    [HoraSalida] DATETIME NOT NULL,
    [Motivo] INT NOT NULL,
    [TipoPermiso] INT,
    [Observacion1] CHAR(100),
    [Observacion2] CHAR(100),
    [Estado] BIT,
    CONSTRAINT [PK_Permisos] PRIMARY KEY CLUSTERED ([Codigo],[Fecha],[HoraEntrada])
);

-- CreateTable
CREATE TABLE [dbo].[Producto] (
    [COD_ART] CHAR(7) NOT NULL,
    [ARTICULO] CHAR(40),
    [CONSECUTIVO] DECIMAL(18,0),
    [PESO] CHAR(10),
    [EMPCAJA] DECIMAL(18,0),
    [UNDCAJA] DECIMAL(18,0),
    [EMBALAJE] CHAR(10),
    [PRECIO] DECIMAL(10,2),
    [PRECIOSIMP] DECIMAL(10,2),
    [EXISTENCIA] DECIMAL(18,0),
    [COD_BARRA] CHAR(15),
    [INDICADOR] CHAR(1),
    [CONTROL] CHAR(40),
    [CODIGOCABYS] VARCHAR(50)
);

-- CreateTable
CREATE TABLE [dbo].[Productos] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [CodArticulo] NVARCHAR(7) NOT NULL,
    [NomArticulo] NVARCHAR(40) NOT NULL,
    [UnidadCaja] INT NOT NULL,
    [Peso] NVARCHAR(10) NOT NULL,
    [Embalaje] NVARCHAR(10) NOT NULL,
    [Precio] DECIMAL(9,2) NOT NULL,
    [PreciosImpuesto] DECIMAL(9,2) NOT NULL,
    [CodCabys] NVARCHAR(50) NOT NULL,
    [Url] NVARCHAR(250) NOT NULL,
    [secuencia] INT NOT NULL,
    [Estado] INT NOT NULL,
    [CreatedDate] DATETIME2,
    [CreatedBy] NVARCHAR(max),
    [LastModifiedDate] DATETIME2,
    [LastModifiedBy] NVARCHAR(max),
    CONSTRAINT [PK_Productos] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[Secciones] (
    [Seccion_Codigo] CHAR(3) NOT NULL,
    [Seccion_Nombre] CHAR(30),
    [Planta_Numero] CHAR(2),
    [Codigo_ERP] CHAR(10)
);

-- CreateTable
CREATE TABLE [dbo].[Supervisores] (
    [Cod_Sup] CHAR(4) NOT NULL,
    [Nombre] CHAR(35),
    [NombreUsr] CHAR(25),
    [Puesto] CHAR(50),
    [Estado] BIT,
    [Clave] CHAR(20),
    [Nivel] INT
);

-- CreateTable
CREATE TABLE [dbo].[SupervisorGrupo] (
    [Cod_Sup] CHAR(4) NOT NULL,
    [Grupo] INT NOT NULL,
    CONSTRAINT [PK_SupervisorGrupo] PRIMARY KEY CLUSTERED ([Cod_Sup],[Grupo])
);

-- CreateTable
CREATE TABLE [dbo].[sysdiagrams] (
    [name] NVARCHAR(128) NOT NULL,
    [principal_id] INT NOT NULL,
    [diagram_id] INT NOT NULL IDENTITY(1,1),
    [version] INT,
    [definition] VARBINARY(max),
    CONSTRAINT [PK__sysdiagrams__4E88ABD4] PRIMARY KEY CLUSTERED ([diagram_id]),
    CONSTRAINT [UK_principal_name] UNIQUE NONCLUSTERED ([principal_id],[name])
);

-- CreateTable
CREATE TABLE [dbo].[Tardias] (
    [Codigo] CHAR(4) NOT NULL,
    [Fecha] DATETIME NOT NULL,
    [HoraEntrada] CHAR(5) NOT NULL,
    [EntradaTurno] CHAR(5) NOT NULL,
    CONSTRAINT [PK_Tardias] PRIMARY KEY CLUSTERED ([Codigo],[Fecha],[HoraEntrada])
);

-- CreateTable
CREATE TABLE [dbo].[Temp_Diario_Marcas] (
    [Codigo] CHAR(4) NOT NULL,
    [Fecha] DATETIME NOT NULL,
    [Hora] DATETIME NOT NULL,
    [Funcion] CHAR(3) NOT NULL,
    CONSTRAINT [PK_Temp_Diario_Marcas] PRIMARY KEY CLUSTERED ([Codigo],[Fecha],[Hora])
);

-- CreateTable
CREATE TABLE [dbo].[Temp_Marcas] (
    [Codigo] CHAR(4) NOT NULL,
    [Fecha] DATETIME NOT NULL,
    [Entrada] CHAR(5),
    [Salida] CHAR(5),
    [Ord] DECIMAL(10,2) NOT NULL,
    [Ext] DECIMAL(10,2) NOT NULL,
    [Dob] DECIMAL(10,2) NOT NULL,
    [Rep] DECIMAL(10,2) NOT NULL,
    [Estado] BIT,
    [Control] CHAR(1),
    [Vac] DECIMAL(10,2) NOT NULL,
    [Inc] DECIMAL(10,2) NOT NULL,
    [Observaciones] CHAR(100),
    [Entrada1] CHAR(5),
    [Salida1] CHAR(5),
    [Entrada2] CHAR(5),
    [Salida2] CHAR(5),
    [Entrada3] CHAR(5),
    [Salida3] CHAR(5),
    [Totales] DECIMAL(10,2),
    [Turno] INT,
    CONSTRAINT [PK_Temp_Marcas] PRIMARY KEY CLUSTERED ([Codigo],[Fecha])
);

-- AddForeignKey
ALTER TABLE [dbo].[detalle_pedido_ec] ADD CONSTRAINT [detalle_pedido_id_pedido_fkey] FOREIGN KEY ([id_pedido]) REFERENCES [dbo].[pedidos_ec]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[facturacion_ec] ADD CONSTRAINT [facturacion_id_pedido_fkey] FOREIGN KEY ([id_pedido]) REFERENCES [dbo].[pedidos_ec]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[pedidos_ec] ADD CONSTRAINT [FK__pedidos__id_usua__075714DC] FOREIGN KEY ([id_usuario]) REFERENCES [dbo].[usuarios_ecommerce]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[pedidos_ec] ADD CONSTRAINT [FK_Pedidos_Facturacion] FOREIGN KEY ([id_factura]) REFERENCES [dbo].[facturacion_ec]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
