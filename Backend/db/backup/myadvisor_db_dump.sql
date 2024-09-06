PGDMP  $                    |            myadvisor_db    16.4    16.4 �    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    24961    myadvisor_db    DATABASE     �   CREATE DATABASE myadvisor_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_South Africa.1252';
    DROP DATABASE myadvisor_db;
                postgres    false            �            1259    24962    SequelizeMeta    TABLE     R   CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);
 #   DROP TABLE public."SequelizeMeta";
       public         heap    postgres    false            �            1259    25462    adviceRecord    TABLE        CREATE TABLE public."adviceRecord" (
    id integer NOT NULL,
    "appointmentID" integer,
    notes character varying(255)
);
 "   DROP TABLE public."adviceRecord";
       public         heap    postgres    false            �            1259    25461    adviceRecord_id_seq    SEQUENCE     �   CREATE SEQUENCE public."adviceRecord_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public."adviceRecord_id_seq";
       public          postgres    false    240            �           0    0    adviceRecord_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public."adviceRecord_id_seq" OWNED BY public."adviceRecord".id;
          public          postgres    false    239            �            1259    25502    advisor    TABLE     :  CREATE TABLE public.advisor (
    id integer NOT NULL,
    name character varying(255),
    surname character varying(255),
    email character varying(255),
    password character varying(255),
    office character varying(255),
    advisor_level character varying(255),
    profile_url character varying(255)
);
    DROP TABLE public.advisor;
       public         heap    postgres    false            �            1259    25441    advisorMajor    TABLE        CREATE TABLE public."advisorMajor" (
    id integer NOT NULL,
    "advisorID" integer,
    "majorID" character varying(255)
);
 "   DROP TABLE public."advisorMajor";
       public         heap    postgres    false            �            1259    25440    advisorMajor_id_seq    SEQUENCE     �   CREATE SEQUENCE public."advisorMajor_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public."advisorMajor_id_seq";
       public          postgres    false    234            �           0    0    advisorMajor_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public."advisorMajor_id_seq" OWNED BY public."advisorMajor".id;
          public          postgres    false    233            �            1259    25501    advisor_id_seq    SEQUENCE     �   CREATE SEQUENCE public.advisor_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.advisor_id_seq;
       public          postgres    false    248            �           0    0    advisor_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.advisor_id_seq OWNED BY public.advisor.id;
          public          postgres    false    247            �            1259    25455    appointment    TABLE     �   CREATE TABLE public.appointment (
    id integer NOT NULL,
    "studentID" integer,
    "advisorID" integer,
    date date,
    "time" time without time zone,
    comment character varying(255)
);
    DROP TABLE public.appointment;
       public         heap    postgres    false            �            1259    25511    appointmentRequest    TABLE     �   CREATE TABLE public."appointmentRequest" (
    id integer NOT NULL,
    "appointmentID" integer,
    read boolean,
    "availabilityID" integer,
    "timestamp" timestamp without time zone
);
 (   DROP TABLE public."appointmentRequest";
       public         heap    postgres    false            �            1259    25510    appointmentRequest_id_seq    SEQUENCE     �   CREATE SEQUENCE public."appointmentRequest_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public."appointmentRequest_id_seq";
       public          postgres    false    250            �           0    0    appointmentRequest_id_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public."appointmentRequest_id_seq" OWNED BY public."appointmentRequest".id;
          public          postgres    false    249            �            1259    25454    appointment_id_seq    SEQUENCE     �   CREATE SEQUENCE public.appointment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.appointment_id_seq;
       public          postgres    false    238            �           0    0    appointment_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.appointment_id_seq OWNED BY public.appointment.id;
          public          postgres    false    237            �            1259    25448    availability    TABLE     �   CREATE TABLE public.availability (
    id integer NOT NULL,
    date date,
    "time" time without time zone,
    "advisorID" integer,
    "isAvailable" boolean
);
     DROP TABLE public.availability;
       public         heap    postgres    false            �            1259    25447    availability_id_seq    SEQUENCE     �   CREATE SEQUENCE public.availability_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.availability_id_seq;
       public          postgres    false    236            �           0    0    availability_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.availability_id_seq OWNED BY public.availability.id;
          public          postgres    false    235            �            1259    25469    completedCourse    TABLE     �   CREATE TABLE public."completedCourse" (
    id integer NOT NULL,
    "studentID" integer,
    "courseID" character varying(255)
);
 %   DROP TABLE public."completedCourse";
       public         heap    postgres    false            �            1259    25468    completedCourse_id_seq    SEQUENCE     �   CREATE SEQUENCE public."completedCourse_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public."completedCourse_id_seq";
       public          postgres    false    242            �           0    0    completedCourse_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public."completedCourse_id_seq" OWNED BY public."completedCourse".id;
          public          postgres    false    241            �            1259    25399    course    TABLE     �   CREATE TABLE public.course (
    id character varying(255) NOT NULL,
    "courseName" character varying(255),
    credits integer,
    nqf_level integer
);
    DROP TABLE public.course;
       public         heap    postgres    false            �            1259    25216 
   department    TABLE     v   CREATE TABLE public.department (
    id integer NOT NULL,
    name character varying(255),
    "facultyID" integer
);
    DROP TABLE public.department;
       public         heap    postgres    false            �            1259    25215    department_id_seq    SEQUENCE     �   CREATE SEQUENCE public.department_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.department_id_seq;
       public          postgres    false    219            �           0    0    department_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.department_id_seq OWNED BY public.department.id;
          public          postgres    false    218            �            1259    25209    faculty    TABLE     c   CREATE TABLE public.faculty (
    id integer NOT NULL,
    "facultyName" character varying(255)
);
    DROP TABLE public.faculty;
       public         heap    postgres    false            �            1259    25432    facultyAdmin    TABLE       CREATE TABLE public."facultyAdmin" (
    id integer NOT NULL,
    name character varying(255),
    surname character varying(255),
    email character varying(255),
    password character varying(255),
    "facultyID" integer,
    profile_url character varying(255)
);
 "   DROP TABLE public."facultyAdmin";
       public         heap    postgres    false            �            1259    25431    facultyAdmin_id_seq    SEQUENCE     �   CREATE SEQUENCE public."facultyAdmin_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public."facultyAdmin_id_seq";
       public          postgres    false    232            �           0    0    facultyAdmin_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public."facultyAdmin_id_seq" OWNED BY public."facultyAdmin".id;
          public          postgres    false    231            �            1259    25208    faculty_id_seq    SEQUENCE     �   CREATE SEQUENCE public.faculty_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.faculty_id_seq;
       public          postgres    false    217            �           0    0    faculty_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.faculty_id_seq OWNED BY public.faculty.id;
          public          postgres    false    216            �            1259    25311    major    TABLE     �   CREATE TABLE public.major (
    id character varying(255) NOT NULL,
    "majorName" character varying(255),
    "departmentID" integer
);
    DROP TABLE public.major;
       public         heap    postgres    false            �            1259    25485    notification    TABLE     �   CREATE TABLE public.notification (
    id integer NOT NULL,
    type character varying(255),
    "appointmentID" integer,
    "studentID" integer,
    "timestamp" timestamp without time zone,
    comment character varying(255),
    read boolean
);
     DROP TABLE public.notification;
       public         heap    postgres    false            �            1259    25484    notification_id_seq    SEQUENCE     �   CREATE SEQUENCE public.notification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.notification_id_seq;
       public          postgres    false    246            �           0    0    notification_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.notification_id_seq OWNED BY public.notification.id;
          public          postgres    false    245            �            1259    25423    prerequisite    TABLE     �   CREATE TABLE public.prerequisite (
    id integer NOT NULL,
    "courseID" character varying(255),
    "prerequisiteID" character varying(255)
);
     DROP TABLE public.prerequisite;
       public         heap    postgres    false            �            1259    25422    prerequisite_id_seq    SEQUENCE     �   CREATE SEQUENCE public.prerequisite_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.prerequisite_id_seq;
       public          postgres    false    230            �           0    0    prerequisite_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.prerequisite_id_seq OWNED BY public.prerequisite.id;
          public          postgres    false    229            �            1259    25415 	   programme    TABLE     �   CREATE TABLE public.programme (
    id character varying(255) NOT NULL,
    "programmeName" character varying(255),
    "facultyID" integer,
    "coreElectiveCount" integer
);
    DROP TABLE public.programme;
       public         heap    postgres    false            �            1259    25407    sharedCourse    TABLE     �   CREATE TABLE public."sharedCourse" (
    id integer NOT NULL,
    "majorID" character varying(255),
    "courseID" character varying(255),
    "programmeID" character varying(255)
);
 "   DROP TABLE public."sharedCourse";
       public         heap    postgres    false            �            1259    25406    sharedCourse_id_seq    SEQUENCE     �   CREATE SEQUENCE public."sharedCourse_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public."sharedCourse_id_seq";
       public          postgres    false    227            �           0    0    sharedCourse_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public."sharedCourse_id_seq" OWNED BY public."sharedCourse".id;
          public          postgres    false    226            �            1259    25379    student    TABLE       CREATE TABLE public.student (
    id integer NOT NULL,
    name character varying(255),
    surname character varying(255),
    email character varying(255),
    password character varying(255),
    "programmeID" character varying(255),
    profile_url character varying(255)
);
    DROP TABLE public.student;
       public         heap    postgres    false            �            1259    25378    student_id_seq    SEQUENCE     �   CREATE SEQUENCE public.student_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.student_id_seq;
       public          postgres    false    222            �           0    0    student_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.student_id_seq OWNED BY public.student.id;
          public          postgres    false    221            �            1259    25393    studentsMajor    TABLE     �   CREATE TABLE public."studentsMajor" (
    id integer NOT NULL,
    "studentID" integer,
    "majorID" character varying(255)
);
 #   DROP TABLE public."studentsMajor";
       public         heap    postgres    false            �            1259    25392    studentsMajor_id_seq    SEQUENCE     �   CREATE SEQUENCE public."studentsMajor_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public."studentsMajor_id_seq";
       public          postgres    false    224            �           0    0    studentsMajor_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public."studentsMajor_id_seq" OWNED BY public."studentsMajor".id;
          public          postgres    false    223            �            1259    25476    uploadedFile    TABLE     �   CREATE TABLE public."uploadedFile" (
    id integer NOT NULL,
    "appointmentID" integer,
    "fileName" character varying(255),
    "filePathURL" character varying(255)
);
 "   DROP TABLE public."uploadedFile";
       public         heap    postgres    false            �            1259    25475    uploadedFile_id_seq    SEQUENCE     �   CREATE SEQUENCE public."uploadedFile_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public."uploadedFile_id_seq";
       public          postgres    false    244            �           0    0    uploadedFile_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public."uploadedFile_id_seq" OWNED BY public."uploadedFile".id;
          public          postgres    false    243            �           2604    25465    adviceRecord id    DEFAULT     v   ALTER TABLE ONLY public."adviceRecord" ALTER COLUMN id SET DEFAULT nextval('public."adviceRecord_id_seq"'::regclass);
 @   ALTER TABLE public."adviceRecord" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    239    240    240            �           2604    25505 
   advisor id    DEFAULT     h   ALTER TABLE ONLY public.advisor ALTER COLUMN id SET DEFAULT nextval('public.advisor_id_seq'::regclass);
 9   ALTER TABLE public.advisor ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    247    248    248            �           2604    25444    advisorMajor id    DEFAULT     v   ALTER TABLE ONLY public."advisorMajor" ALTER COLUMN id SET DEFAULT nextval('public."advisorMajor_id_seq"'::regclass);
 @   ALTER TABLE public."advisorMajor" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    233    234    234            �           2604    25458    appointment id    DEFAULT     p   ALTER TABLE ONLY public.appointment ALTER COLUMN id SET DEFAULT nextval('public.appointment_id_seq'::regclass);
 =   ALTER TABLE public.appointment ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    237    238    238            �           2604    25514    appointmentRequest id    DEFAULT     �   ALTER TABLE ONLY public."appointmentRequest" ALTER COLUMN id SET DEFAULT nextval('public."appointmentRequest_id_seq"'::regclass);
 F   ALTER TABLE public."appointmentRequest" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    249    250    250            �           2604    25451    availability id    DEFAULT     r   ALTER TABLE ONLY public.availability ALTER COLUMN id SET DEFAULT nextval('public.availability_id_seq'::regclass);
 >   ALTER TABLE public.availability ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    236    235    236            �           2604    25472    completedCourse id    DEFAULT     |   ALTER TABLE ONLY public."completedCourse" ALTER COLUMN id SET DEFAULT nextval('public."completedCourse_id_seq"'::regclass);
 C   ALTER TABLE public."completedCourse" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    242    241    242            �           2604    25219    department id    DEFAULT     n   ALTER TABLE ONLY public.department ALTER COLUMN id SET DEFAULT nextval('public.department_id_seq'::regclass);
 <   ALTER TABLE public.department ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    219    218    219            �           2604    25212 
   faculty id    DEFAULT     h   ALTER TABLE ONLY public.faculty ALTER COLUMN id SET DEFAULT nextval('public.faculty_id_seq'::regclass);
 9   ALTER TABLE public.faculty ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    217    216    217            �           2604    25435    facultyAdmin id    DEFAULT     v   ALTER TABLE ONLY public."facultyAdmin" ALTER COLUMN id SET DEFAULT nextval('public."facultyAdmin_id_seq"'::regclass);
 @   ALTER TABLE public."facultyAdmin" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    231    232    232            �           2604    25488    notification id    DEFAULT     r   ALTER TABLE ONLY public.notification ALTER COLUMN id SET DEFAULT nextval('public.notification_id_seq'::regclass);
 >   ALTER TABLE public.notification ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    245    246    246            �           2604    25426    prerequisite id    DEFAULT     r   ALTER TABLE ONLY public.prerequisite ALTER COLUMN id SET DEFAULT nextval('public.prerequisite_id_seq'::regclass);
 >   ALTER TABLE public.prerequisite ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    229    230    230            �           2604    25410    sharedCourse id    DEFAULT     v   ALTER TABLE ONLY public."sharedCourse" ALTER COLUMN id SET DEFAULT nextval('public."sharedCourse_id_seq"'::regclass);
 @   ALTER TABLE public."sharedCourse" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    226    227    227            �           2604    25382 
   student id    DEFAULT     h   ALTER TABLE ONLY public.student ALTER COLUMN id SET DEFAULT nextval('public.student_id_seq'::regclass);
 9   ALTER TABLE public.student ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    222    221    222            �           2604    25396    studentsMajor id    DEFAULT     x   ALTER TABLE ONLY public."studentsMajor" ALTER COLUMN id SET DEFAULT nextval('public."studentsMajor_id_seq"'::regclass);
 A   ALTER TABLE public."studentsMajor" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    224    223    224            �           2604    25479    uploadedFile id    DEFAULT     v   ALTER TABLE ONLY public."uploadedFile" ALTER COLUMN id SET DEFAULT nextval('public."uploadedFile_id_seq"'::regclass);
 @   ALTER TABLE public."uploadedFile" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    244    243    244            r          0    24962    SequelizeMeta 
   TABLE DATA           /   COPY public."SequelizeMeta" (name) FROM stdin;
    public          postgres    false    215   ��       �          0    25462    adviceRecord 
   TABLE DATA           D   COPY public."adviceRecord" (id, "appointmentID", notes) FROM stdin;
    public          postgres    false    240   ��       �          0    25502    advisor 
   TABLE DATA           i   COPY public.advisor (id, name, surname, email, password, office, advisor_level, profile_url) FROM stdin;
    public          postgres    false    248   ̏       �          0    25441    advisorMajor 
   TABLE DATA           D   COPY public."advisorMajor" (id, "advisorID", "majorID") FROM stdin;
    public          postgres    false    234   8�       �          0    25455    appointment 
   TABLE DATA           Z   COPY public.appointment (id, "studentID", "advisorID", date, "time", comment) FROM stdin;
    public          postgres    false    238   �       �          0    25511    appointmentRequest 
   TABLE DATA           h   COPY public."appointmentRequest" (id, "appointmentID", read, "availabilityID", "timestamp") FROM stdin;
    public          postgres    false    250   )�       �          0    25448    availability 
   TABLE DATA           T   COPY public.availability (id, date, "time", "advisorID", "isAvailable") FROM stdin;
    public          postgres    false    236   F�       �          0    25469    completedCourse 
   TABLE DATA           H   COPY public."completedCourse" (id, "studentID", "courseID") FROM stdin;
    public          postgres    false    242   c�       |          0    25399    course 
   TABLE DATA           F   COPY public.course (id, "courseName", credits, nqf_level) FROM stdin;
    public          postgres    false    225   ��       v          0    25216 
   department 
   TABLE DATA           ;   COPY public.department (id, name, "facultyID") FROM stdin;
    public          postgres    false    219   |�       t          0    25209    faculty 
   TABLE DATA           4   COPY public.faculty (id, "facultyName") FROM stdin;
    public          postgres    false    217   G�       �          0    25432    facultyAdmin 
   TABLE DATA           f   COPY public."facultyAdmin" (id, name, surname, email, password, "facultyID", profile_url) FROM stdin;
    public          postgres    false    232   ��       w          0    25311    major 
   TABLE DATA           @   COPY public.major (id, "majorName", "departmentID") FROM stdin;
    public          postgres    false    220   �       �          0    25485    notification 
   TABLE DATA           j   COPY public.notification (id, type, "appointmentID", "studentID", "timestamp", comment, read) FROM stdin;
    public          postgres    false    246   3�       �          0    25423    prerequisite 
   TABLE DATA           H   COPY public.prerequisite (id, "courseID", "prerequisiteID") FROM stdin;
    public          postgres    false    230   P�                 0    25415 	   programme 
   TABLE DATA           Z   COPY public.programme (id, "programmeName", "facultyID", "coreElectiveCount") FROM stdin;
    public          postgres    false    228   m�       ~          0    25407    sharedCourse 
   TABLE DATA           R   COPY public."sharedCourse" (id, "majorID", "courseID", "programmeID") FROM stdin;
    public          postgres    false    227   ��       y          0    25379    student 
   TABLE DATA           a   COPY public.student (id, name, surname, email, password, "programmeID", profile_url) FROM stdin;
    public          postgres    false    222   �       {          0    25393    studentsMajor 
   TABLE DATA           E   COPY public."studentsMajor" (id, "studentID", "majorID") FROM stdin;
    public          postgres    false    224   <�       �          0    25476    uploadedFile 
   TABLE DATA           X   COPY public."uploadedFile" (id, "appointmentID", "fileName", "filePathURL") FROM stdin;
    public          postgres    false    244   Y�       �           0    0    adviceRecord_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public."adviceRecord_id_seq"', 1, false);
          public          postgres    false    239            �           0    0    advisorMajor_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public."advisorMajor_id_seq"', 42, true);
          public          postgres    false    233            �           0    0    advisor_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.advisor_id_seq', 19, true);
          public          postgres    false    247            �           0    0    appointmentRequest_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public."appointmentRequest_id_seq"', 1, false);
          public          postgres    false    249            �           0    0    appointment_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.appointment_id_seq', 1, false);
          public          postgres    false    237            �           0    0    availability_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.availability_id_seq', 1, false);
          public          postgres    false    235            �           0    0    completedCourse_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public."completedCourse_id_seq"', 1, false);
          public          postgres    false    241            �           0    0    department_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.department_id_seq', 13, true);
          public          postgres    false    218            �           0    0    facultyAdmin_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public."facultyAdmin_id_seq"', 1, true);
          public          postgres    false    231            �           0    0    faculty_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.faculty_id_seq', 2, true);
          public          postgres    false    216            �           0    0    notification_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.notification_id_seq', 1, false);
          public          postgres    false    245            �           0    0    prerequisite_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.prerequisite_id_seq', 1, false);
          public          postgres    false    229            �           0    0    sharedCourse_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public."sharedCourse_id_seq"', 65, true);
          public          postgres    false    226            �           0    0    student_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.student_id_seq', 1, false);
          public          postgres    false    221            �           0    0    studentsMajor_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public."studentsMajor_id_seq"', 1, false);
          public          postgres    false    223            �           0    0    uploadedFile_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public."uploadedFile_id_seq"', 1, false);
          public          postgres    false    243            �           2606    24966     SequelizeMeta SequelizeMeta_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);
 N   ALTER TABLE ONLY public."SequelizeMeta" DROP CONSTRAINT "SequelizeMeta_pkey";
       public            postgres    false    215            �           2606    25467    adviceRecord adviceRecord_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public."adviceRecord"
    ADD CONSTRAINT "adviceRecord_pkey" PRIMARY KEY (id);
 L   ALTER TABLE ONLY public."adviceRecord" DROP CONSTRAINT "adviceRecord_pkey";
       public            postgres    false    240            �           2606    25446    advisorMajor advisorMajor_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public."advisorMajor"
    ADD CONSTRAINT "advisorMajor_pkey" PRIMARY KEY (id);
 L   ALTER TABLE ONLY public."advisorMajor" DROP CONSTRAINT "advisorMajor_pkey";
       public            postgres    false    234            �           2606    25509    advisor advisor_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.advisor
    ADD CONSTRAINT advisor_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.advisor DROP CONSTRAINT advisor_pkey;
       public            postgres    false    248            �           2606    25516 *   appointmentRequest appointmentRequest_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public."appointmentRequest"
    ADD CONSTRAINT "appointmentRequest_pkey" PRIMARY KEY (id);
 X   ALTER TABLE ONLY public."appointmentRequest" DROP CONSTRAINT "appointmentRequest_pkey";
       public            postgres    false    250            �           2606    25460    appointment appointment_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.appointment
    ADD CONSTRAINT appointment_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.appointment DROP CONSTRAINT appointment_pkey;
       public            postgres    false    238            �           2606    25453    availability availability_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.availability
    ADD CONSTRAINT availability_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.availability DROP CONSTRAINT availability_pkey;
       public            postgres    false    236            �           2606    25474 $   completedCourse completedCourse_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public."completedCourse"
    ADD CONSTRAINT "completedCourse_pkey" PRIMARY KEY (id);
 R   ALTER TABLE ONLY public."completedCourse" DROP CONSTRAINT "completedCourse_pkey";
       public            postgres    false    242            �           2606    25405    course course_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.course DROP CONSTRAINT course_pkey;
       public            postgres    false    225            �           2606    25221    department department_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.department
    ADD CONSTRAINT department_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.department DROP CONSTRAINT department_pkey;
       public            postgres    false    219            �           2606    25439    facultyAdmin facultyAdmin_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public."facultyAdmin"
    ADD CONSTRAINT "facultyAdmin_pkey" PRIMARY KEY (id);
 L   ALTER TABLE ONLY public."facultyAdmin" DROP CONSTRAINT "facultyAdmin_pkey";
       public            postgres    false    232            �           2606    25214    faculty faculty_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.faculty
    ADD CONSTRAINT faculty_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.faculty DROP CONSTRAINT faculty_pkey;
       public            postgres    false    217            �           2606    25317    major major_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.major
    ADD CONSTRAINT major_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.major DROP CONSTRAINT major_pkey;
       public            postgres    false    220            �           2606    25492    notification notification_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.notification DROP CONSTRAINT notification_pkey;
       public            postgres    false    246            �           2606    25430    prerequisite prerequisite_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.prerequisite
    ADD CONSTRAINT prerequisite_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.prerequisite DROP CONSTRAINT prerequisite_pkey;
       public            postgres    false    230            �           2606    25421    programme programme_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.programme
    ADD CONSTRAINT programme_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.programme DROP CONSTRAINT programme_pkey;
       public            postgres    false    228            �           2606    25414    sharedCourse sharedCourse_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public."sharedCourse"
    ADD CONSTRAINT "sharedCourse_pkey" PRIMARY KEY (id);
 L   ALTER TABLE ONLY public."sharedCourse" DROP CONSTRAINT "sharedCourse_pkey";
       public            postgres    false    227            �           2606    25386    student student_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.student DROP CONSTRAINT student_pkey;
       public            postgres    false    222            �           2606    25398     studentsMajor studentsMajor_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public."studentsMajor"
    ADD CONSTRAINT "studentsMajor_pkey" PRIMARY KEY (id);
 N   ALTER TABLE ONLY public."studentsMajor" DROP CONSTRAINT "studentsMajor_pkey";
       public            postgres    false    224            �           2606    25483    uploadedFile uploadedFile_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public."uploadedFile"
    ADD CONSTRAINT "uploadedFile_pkey" PRIMARY KEY (id);
 L   ALTER TABLE ONLY public."uploadedFile" DROP CONSTRAINT "uploadedFile_pkey";
       public            postgres    false    244            r   �   x�u�In�0н��@cߥV�[��j��7-�!���3-�/�Pld���koB�~S]���s'6��
,FH��\^�j���^�Jk��q.��d�ɢ���8j���Gq[�|BB{�8��S�H������_�2�Vq͛�z���	!�A9���P��@��ѡ��b4�¥��?���l�[�>:,�E����] ��9̍{v��9��@��¤�@�5[ѻ#��0��v��]��^      �      x������ � �      �   \  x����N�0��ӧ�쎒�M��@U�5H\�L�!1��v��>�:I٭��r��Q�e<��1\چd��P�����+R��	[;%��B\i��96"+$��e'�R�Xn�6�t7I`)M%\�VB>hd��ә�_�5�m�5�ˆ�#i k4�@����.cq˺ѕ,�9���k`�{6^�F5� 5���]CF,e�߇�s�^�x���n���> �=���QlH�1��VRW5���e�X�68���UQ�&�>��o��+n�҆A�uQX���k�s?^gd��dH�l����q�2�[V>_~H���
a����l�b����.gx�%�^���,��pLM`GJ��Δ����>�PN��?�L�)�mEpWu9�����X	^�xzz3�5\i��LIWC5:����&��:7TK7�K��o��>�-��)��bK�fEN6����5�'���'M�
�;�����x��x��"oԊ5����PB_��J������~�~yKr>�6�Ë����н�$�Gq�d��d���97��3Xt������h���c��[2�����i.��1$���4���N&�?k�19      �   �   x�=�1
�0��Y:L�$;��4��������OX�����c!���Kc��kc�*�5$�HCKHy�N#�����1	*�R���Eb��D��������Qww4�=j!��Jsu�^�=��f�Ҙ/��Ww��*��T���?h�T��bSG|7w�Qc��4�;�h��4��=����TIc���|o��UL      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      |   �  x��VMs�6=ӿ'_�1I�vo��4�j�&m&��%�$��2��}P$$��NO��o�o�.0���/�i��J�,N�P�`���{Û���13\�b�.f�bF-&��AO���7j0AO��b�oަ,v%�s�vl���:��|�	��s}�w�`�賃	(λwl�8ck���������{+U�EZ'�,�l&uR�J��ڋ�W2і��Ko]�"˨�[6>2)R���(������x~"�NpF_\3��2�9��8=rT��)ϒ:�= �֎�P//�8ۉ璻FĞɗQ�v�36�Qs��"B�R���8Q�}�+���t�#$�T�Rq���a�}�sQ��pH��P2[S�g�@���V)���g�`��s&�"��޹Y.�d��V�us��i��a�-�(�-�4+^z�=��s��x;Fԑ�e�W��te� �|Z`۽��ܲ�2�&��s�Fuk�k^�]��D��!�V�Š_h;J�S[ſ5N�1�'�%W]�Α?���ݜ��:�Vd�o�+��b/E3���Bh:�(l	�.~u��d�G+�:�䑗�c)\����mj��rZ�\<��t���?>�=ۊd����+���Z�CG���y�H(�b����v!�*���f��clX;F��>q�~d�N��t��<�s�p��)G���p��o��ۯ���Ejhn�^tOwÜj�F���8��s�F.6yU�y&���A�P9��]ݲM���^�Lj�Wި	įBQǋ]Mݜɝ�(��^(������p�?�4%�O��b�U'4����5�ѡ�noz����֚�X� 	��,�f��x:%�,��Jh=��[����?Hh�6߁<`,ZX��q�,��&�n}S֌#&��Zm`v��<:c���,�R�<��8�������s��[Zf��&yB/'��	3��Rjqf��a�vex^�F�e��LVOv�L�<��R8Y�	���j�6�GQjY5��tbGЁ`;e�퓣�JcY�y�hZ�ҩ3lr�i+B�Q��
�M}��N�-�H����L�T�;��/��i�o��f��dx	�E���}H{�ĤԴL �Q��̠�2y���j��:�>�=:���8p~,��̧������(���_h5�����1{��$Y�m#��.+���t��N���F�dȲk%��O�e}��Pl]F�3 ��D����_���A�yȄy���f��?�����s��      v   �   x�m�K�0�����ci�ϣ�b/҂�^B��@c��R�����7�jo�)b`���$�
hEThE�rd9���h|��KT	]�{$)̷��ԄQfR{x�y\*����۔�
R	���I�����w��{k�Yt���5�� �&	�[h�A9����L�y��6Y��V�{�K�Kny���&˲c	_(      t   B   x�3�N�L�KN�2�t���M-2�9]��3�RS�2����J3sJ\��2���rS�J�b���� D%�      �   8   x�3��N,J���L�K�K�����!<�����d��DΒ��NC�?�=... �      w   B  x�MQ�n�0���𔱊!i��PD:��r:T�b�'�6�M$��ϔF��޻�W�jω�N��Th�WAמ$T������T�E�\�*��m&r�B��	>8;����gZ�3mk�r7�����'�w���\�(�F�x�r�cЦ!��E4�?ԇ���?8V�U�:����SE)qEa��YӃ	�c;V�m�Z]���:�>��y�qY\P^.ayBϟ?���+ÄQ��λ���ǘh�R�ؚ6�����z[n�7������p]z=RY,�R��1z���Ӹ��d��7ԃ��wH�ǨLБv���~���QC��      �      x������ � �      �      x������ � �            x������ � �      ~   �  x�]��j�0 �s�0Cv�cR�C�Ac���s$y�v1�C�eY�i{n���� r�^������ح���$X�ܥ���4����o�KŢɈ=�k�!d�%�'��;A��J���Q������beb	h�!p��~#�E�Hr�V�H��K�k0���a�t
�(-2������}7<m5���8^�=���h���F2�v0��X��Չ媘G�n��7�u�w�c��KGj(��b���FBm#��Ϛ�.�$jǔ��s@YY�p�PKGn�3O����.I@�=�c]�{�Ȅ�MH����wd�3I@ߨ�};���ǽ�kO�#�Gh�K@O_Z�Rq���nh��xgt�(����~DZ:����œG������<Ͽ#��      y      x������ � �      {      x������ � �      �      x������ � �     