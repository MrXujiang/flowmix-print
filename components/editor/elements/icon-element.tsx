"use client"
import {
  Star,
  Heart,
  CheckCircle,
  XCircle,
  Info,
  AlertCircle,
  Bell,
  Calendar,
  Clock,
  Mail,
  Phone,
  User,
  Users,
  Settings,
  Home,
  FileText,
  Folder,
  Globe,
  Map,
  MapPin,
  Search,
  ShoppingCart,
  CreditCard,
  DollarSign,
  Percent,
  Tag,
  Truck,
  Package,
  Gift,
  Award,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Send,
  Share2,
  Link,
  Bookmark,
  Flag,
  Lock,
  Unlock,
  Shield,
  Eye,
  EyeOff,
  Camera,
  Music,
  Video,
  Headphones,
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  Printer,
  Wifi,
  Bluetooth,
  Battery,
  BatteryCharging,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  Wind,
  Thermometer,
  Umbrella,
  Coffee,
  Utensils,
  ShoppingBag,
  Briefcase,
  Book,
  Paperclip,
  Scissors,
  Trash,
  Trash2,
  Archive,
  Save,
  Upload,
  Download,
  ExternalLink,
  RefreshCw,
  RotateCw,
  RotateCcw,
  Maximize,
  Minimize,
  Plus,
  Minus,
  X,
  Check,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  MoreHorizontal,
  MoreVertical,
  Menu,
  List,
  Grid,
  Layout,
  Sidebar,
  PanelLeft,
  PanelRight,
  Columns,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  Edit,
  Copy,
  Clipboard,
  Slash,
  Filter,
  BarChart,
  BarChart2,
  PieChart,
  LineChart,
  Activity,
  TrendingUp,
  TrendingDown,
  Zap,
  Droplet,
  Box,
  Loader,
  Frown,
  Smile,
  Meh,
  Anchor,
  AtSign,
  Axe,
  Banana,
  Bed,
  BellRing,
  Binary,
  Bird,
  Bitcoin,
  Bomb,
  Bone,
  Bot,
  BoxIcon as Box3d,
  Boxes,
  Brain,
  Building,
  Building2,
  Bus,
  Cake,
  Calculator,
  Car,
  CarFront,
  Cat,
  ChefHat,
  Cherry,
  CircleDollarSign,
  CircleUser,
  Citrus,
  Clapperboard,
  Coins,
  Compass,
  Construction,
  Cookie,
  Cpu,
  Crown,
  Dices,
  Dog,
  Dumbbell,
  Egg,
  Factory,
  Fan,
  Fingerprint,
  Fish,
  FlaskConical,
  FlowerIcon,
  ClubIcon as Football,
  Footprints,
  Forklift,
  Gamepad,
  Gauge,
  Ghost,
  Glasses,
  Grape,
  HandMetal,
  Hammer,
  HardHat,
  Hash,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  HelpCircle,
  Hexagon,
  Hourglass,
  IceCream,
  Image,
  Infinity,
  Instagram,
  Key,
  Landmark,
  Languages,
  Laugh,
  Layers,
  Leaf,
  Library,
  Lightbulb,
  Linkedin,
  Loader2,
  Locate,
  LogIn,
  LogOut,
  Magnet,
  Mailbox,
  MapPinned,
  Martini,
  Maximize2,
  Medal,
  Megaphone,
  Mic,
  Microscope,
  Minimize2,
  Mountain,
  MousePointer,
  Move,
  Navigation,
  Network,
  Newspaper,
  Octagon,
  FlagIcon as Orange,
  Orbit,
  Palette,
  TreePalmIcon as PalmTree,
  Pause,
  PawPrint,
  Pen,
  Pencil,
  PersonStanding,
  PhoneCall,
  PhoneForwarded,
  PhoneIncoming,
  PhoneMissed,
  PhoneOff,
  PhoneOutgoing,
  PictureInPicture,
  PiggyBank,
  Pin,
  Pizza,
  Plane,
  Play,
  Plug,
  PlugZap,
  Podcast,
  Power,
  Puzzle,
  QrCode,
  Quote,
  Radio,
  Rainbow,
  Receipt,
  Recycle,
  Refrigerator,
  Rocket,
  RockingChair,
  Sandwich,
  Satellite,
  Scale,
  Scan,
  School,
  ScreenShare,
  Server,
  Ship,
  Shirt,
  Shovel,
  ShowerHeadIcon as Shower,
  Shrub,
  Shuffle,
  Sigma,
  Signal,
  Skull,
  Sliders,
  Snowflake,
  Sofa,
  Soup,
  Speaker,
  Spline,
  Stethoscope,
  Sticker,
  StickyNote,
  StopCircle,
  Store,
  StretchHorizontal,
  StretchVertical,
  Strikethrough,
  Subscript,
  Subtitles,
  Sunrise,
  Sunset,
  Superscript,
  SwissFranc,
  Sword,
  Swords,
  Table,
  Target,
  Tent,
  Terminal,
  ThermometerSnowflake,
  ThermometerSun,
  Ticket,
  Timer,
  TimerOff,
  ToggleLeft,
  ToggleRight,
  Tornado,
  Tractor,
  TrafficCone,
  Train,
  TreeDeciduous,
  TreePine,
  Trophy,
  Tv,
  Tv2,
  Twitch,
  Twitter,
  Type,
  Undo,
  Unlink,
  UsbIcon as UsbStick,
  UserCheck,
  UserCog,
  UserMinus,
  UserPlus,
  UserX,
  UtensilsCrossed,
  Variable,
  Vegan,
  VideoOff,
  View,
  Voicemail,
  Volume,
  Volume1,
  Volume2,
  VolumeX,
  Wallet,
  Wand,
  Watch,
  Waves,
  Webcam,
  WifiOff,
  Wine,
  Workflow,
  Wrench,
  XOctagon,
  XSquare,
  Youtube,
  ZapOff,
  ZoomIn,
  ZoomOut,
} from "lucide-react"
import type { Element } from "@/types/editor"

interface IconElementProps {
  element: Element
}

export default function IconElement({ element }: IconElementProps) {
  const { content, style = {} } = element

  const iconStyle = {
    color: style.fill || "#000000",
    opacity: style.opacity || 1,
    transform: style.rotation ? `rotate(${style.rotation}deg)` : "none",
  }

  const renderIcon = () => {
    const props = { style: iconStyle }

    switch (content) {
      // 基础图标
      case "star":
        return <Star {...props} />
      case "heart":
        return <Heart {...props} />
      case "check":
        return <CheckCircle {...props} />
      case "close":
        return <XCircle {...props} />
      case "info":
        return <Info {...props} />
      case "alert":
        return <AlertCircle {...props} />
      case "bell":
        return <Bell {...props} />
      case "calendar":
        return <Calendar {...props} />
      case "clock":
        return <Clock {...props} />
      case "mail":
        return <Mail {...props} />
      case "phone":
        return <Phone {...props} />
      case "user":
        return <User {...props} />
      case "users":
        return <Users {...props} />
      case "settings":
        return <Settings {...props} />
      case "home":
        return <Home {...props} />
      case "file":
        return <FileText {...props} />
      case "folder":
        return <Folder {...props} />
      case "globe":
        return <Globe {...props} />
      case "map":
        return <Map {...props} />
      case "pin":
        return <MapPin {...props} />
      case "search":
        return <Search {...props} />
      case "cart":
        return <ShoppingCart {...props} />
      case "card":
        return <CreditCard {...props} />
      case "dollar":
        return <DollarSign {...props} />
      case "percent":
        return <Percent {...props} />
      case "tag":
        return <Tag {...props} />
      case "truck":
        return <Truck {...props} />
      case "package":
        return <Package {...props} />
      case "gift":
        return <Gift {...props} />
      case "award":
        return <Award {...props} />
      case "thumbsup":
        return <ThumbsUp {...props} />
      case "thumbsdown":
        return <ThumbsDown {...props} />
      case "message":
        return <MessageCircle {...props} />
      case "send":
        return <Send {...props} />
      case "share":
        return <Share2 {...props} />
      case "link":
        return <Link {...props} />
      case "bookmark":
        return <Bookmark {...props} />
      case "flag":
        return <Flag {...props} />
      case "lock":
        return <Lock {...props} />
      case "unlock":
        return <Unlock {...props} />
      case "shield":
        return <Shield {...props} />
      case "eye":
        return <Eye {...props} />
      case "eyeoff":
        return <EyeOff {...props} />
      case "camera":
        return <Camera {...props} />
      case "music":
        return <Music {...props} />
      case "video":
        return <Video {...props} />
      case "headphones":
        return <Headphones {...props} />
      case "smartphone":
        return <Smartphone {...props} />
      case "tablet":
        return <Tablet {...props} />
      case "laptop":
        return <Laptop {...props} />
      case "monitor":
        return <Monitor {...props} />
      case "printer":
        return <Printer {...props} />
      case "wifi":
        return <Wifi {...props} />
      case "bluetooth":
        return <Bluetooth {...props} />
      case "battery":
        return <Battery {...props} />
      case "charging":
        return <BatteryCharging {...props} />
      case "sun":
        return <Sun {...props} />
      case "moon":
        return <Moon {...props} />
      case "cloud":
        return <Cloud {...props} />
      case "rain":
        return <CloudRain {...props} />
      case "snow":
        return <CloudSnow {...props} />
      case "wind":
        return <Wind {...props} />
      case "thermometer":
        return <Thermometer {...props} />
      case "umbrella":
        return <Umbrella {...props} />
      case "coffee":
        return <Coffee {...props} />
      case "utensils":
        return <Utensils {...props} />
      case "bag":
        return <ShoppingBag {...props} />
      case "briefcase":
        return <Briefcase {...props} />
      case "book":
        return <Book {...props} />
      case "paperclip":
        return <Paperclip {...props} />
      case "scissors":
        return <Scissors {...props} />
      case "trash":
        return <Trash {...props} />
      case "trash2":
        return <Trash2 {...props} />
      case "archive":
        return <Archive {...props} />
      case "save":
        return <Save {...props} />
      case "upload":
        return <Upload {...props} />
      case "download":
        return <Download {...props} />
      case "external":
        return <ExternalLink {...props} />
      case "refresh":
        return <RefreshCw {...props} />
      case "rotatecw":
        return <RotateCw {...props} />
      case "rotateccw":
        return <RotateCcw {...props} />
      case "maximize":
        return <Maximize {...props} />
      case "minimize":
        return <Minimize {...props} />
      case "plus":
        return <Plus {...props} />
      case "minus":
        return <Minus {...props} />
      case "x":
        return <X {...props} />
      case "check":
        return <Check {...props} />
      case "up":
        return <ChevronUp {...props} />
      case "down":
        return <ChevronDown {...props} />
      case "left":
        return <ChevronLeft {...props} />
      case "right":
        return <ChevronRight {...props} />
      case "arrowup":
        return <ArrowUp {...props} />
      case "arrowdown":
        return <ArrowDown {...props} />
      case "arrowleft":
        return <ArrowLeft {...props} />
      case "arrowright":
        return <ArrowRight {...props} />
      case "more":
        return <MoreHorizontal {...props} />
      case "morevert":
        return <MoreVertical {...props} />
      case "menu":
        return <Menu {...props} />
      case "list":
        return <List {...props} />
      case "grid":
        return <Grid {...props} />
      case "layout":
        return <Layout {...props} />
      case "sidebar":
        return <Sidebar {...props} />
      case "panelleft":
        return <PanelLeft {...props} />
      case "panelright":
        return <PanelRight {...props} />
      case "columns":
        return <Columns {...props} />
      case "alignleft":
        return <AlignLeft {...props} />
      case "aligncenter":
        return <AlignCenter {...props} />
      case "alignright":
        return <AlignRight {...props} />
      case "alignjustify":
        return <AlignJustify {...props} />
      case "bold":
        return <Bold {...props} />
      case "italic":
        return <Italic {...props} />
      case "underline":
        return <Underline {...props} />
      case "edit":
        return <Edit {...props} />
      case "copy":
        return <Copy {...props} />
      case "clipboard":
        return <Clipboard {...props} />
      case "slash":
        return <Slash {...props} />
      case "filter":
        return <Filter {...props} />
      case "barchart":
        return <BarChart {...props} />
      case "barchart2":
        return <BarChart2 {...props} />
      case "piechart":
        return <PieChart {...props} />
      case "linechart":
        return <LineChart {...props} />
      case "activity":
        return <Activity {...props} />
      case "trendingup":
        return <TrendingUp {...props} />
      case "trendingdown":
        return <TrendingDown {...props} />
      case "zap":
        return <Zap {...props} />
      case "droplet":
        return <Droplet {...props} />
      case "box":
        return <Box {...props} />
      case "loader":
        return <Loader {...props} />
      case "frown":
        return <Frown {...props} />
      case "smile":
        return <Smile {...props} />
      case "meh":
        return <Meh {...props} />

      // 新增图标
      case "anchor":
        return <Anchor {...props} />
      case "at":
        return <AtSign {...props} />
      case "axe":
        return <Axe {...props} />
      case "banana":
        return <Banana {...props} />
      case "bed":
        return <Bed {...props} />
      case "bellring":
        return <BellRing {...props} />
      case "binary":
        return <Binary {...props} />
      case "bird":
        return <Bird {...props} />
      case "bitcoin":
        return <Bitcoin {...props} />
      case "bomb":
        return <Bomb {...props} />
      case "bone":
        return <Bone {...props} />
      case "bot":
        return <Bot {...props} />
      case "box3d":
        return <Box3d {...props} />
      case "boxes":
        return <Boxes {...props} />
      case "brain":
        return <Brain {...props} />
      case "building":
        return <Building {...props} />
      case "building2":
        return <Building2 {...props} />
      case "bus":
        return <Bus {...props} />
      case "cake":
        return <Cake {...props} />
      case "calculator":
        return <Calculator {...props} />
      case "car":
        return <Car {...props} />
      case "carfront":
        return <CarFront {...props} />
      case "cat":
        return <Cat {...props} />
      case "chefhat":
        return <ChefHat {...props} />
      case "cherry":
        return <Cherry {...props} />
      case "circledollarsign":
        return <CircleDollarSign {...props} />
      case "circleuser":
        return <CircleUser {...props} />
      case "citrus":
        return <Citrus {...props} />
      case "clapperboard":
        return <Clapperboard {...props} />
      case "coins":
        return <Coins {...props} />
      case "compass":
        return <Compass {...props} />
      case "construction":
        return <Construction {...props} />
      case "cookie":
        return <Cookie {...props} />
      case "cpu":
        return <Cpu {...props} />
      case "crown":
        return <Crown {...props} />
      case "dices":
        return <Dices {...props} />
      case "dog":
        return <Dog {...props} />
      case "dumbbell":
        return <Dumbbell {...props} />
      case "egg":
        return <Egg {...props} />
      case "factory":
        return <Factory {...props} />
      case "fan":
        return <Fan {...props} />
      case "fingerprint":
        return <Fingerprint {...props} />
      case "fish":
        return <Fish {...props} />
      case "flask":
        return <FlaskConical {...props} />
      case "flower":
        return <FlowerIcon {...props} />
      case "football":
        return <Football {...props} />
      case "footprints":
        return <Footprints {...props} />
      case "forklift":
        return <Forklift {...props} />
      case "gamepad":
        return <Gamepad {...props} />
      case "gauge":
        return <Gauge {...props} />
      case "ghost":
        return <Ghost {...props} />
      case "glasses":
        return <Glasses {...props} />
      case "grape":
        return <Grape {...props} />
      case "handmetal":
        return <HandMetal {...props} />
      case "hammer":
        return <Hammer {...props} />
      case "hardhat":
        return <HardHat {...props} />
      case "hash":
        return <Hash {...props} />
      case "heading1":
        return <Heading1 {...props} />
      case "heading2":
        return <Heading2 {...props} />
      case "heading3":
        return <Heading3 {...props} />
      case "heading4":
        return <Heading4 {...props} />
      case "heading5":
        return <Heading5 {...props} />
      case "heading6":
        return <Heading6 {...props} />
      case "help":
        return <HelpCircle {...props} />
      case "hexagon":
        return <Hexagon {...props} />
      case "hourglass":
        return <Hourglass {...props} />
      case "icecream":
        return <IceCream {...props} />
      case "image":
        return <Image {...props} />
      case "infinity":
        return <Infinity {...props} />
      case "instagram":
        return <Instagram {...props} />
      case "key":
        return <Key {...props} />
      case "landmark":
        return <Landmark {...props} />
      case "languages":
        return <Languages {...props} />
      case "laugh":
        return <Laugh {...props} />
      case "layers":
        return <Layers {...props} />
      case "leaf":
        return <Leaf {...props} />
      case "library":
        return <Library {...props} />
      case "lightbulb":
        return <Lightbulb {...props} />
      case "linkedin":
        return <Linkedin {...props} />
      case "loader2":
        return <Loader2 {...props} />
      case "locate":
        return <Locate {...props} />
      case "login":
        return <LogIn {...props} />
      case "logout":
        return <LogOut {...props} />
      case "magnet":
        return <Magnet {...props} />
      case "mailbox":
        return <Mailbox {...props} />
      case "mappinned":
        return <MapPinned {...props} />
      case "martini":
        return <Martini {...props} />
      case "maximize2":
        return <Maximize2 {...props} />
      case "medal":
        return <Medal {...props} />
      case "megaphone":
        return <Megaphone {...props} />
      case "mic":
        return <Mic {...props} />
      case "microscope":
        return <Microscope {...props} />
      case "minimize2":
        return <Minimize2 {...props} />
      case "mountain":
        return <Mountain {...props} />
      case "mousepointer":
        return <MousePointer {...props} />
      case "move":
        return <Move {...props} />
      case "navigation":
        return <Navigation {...props} />
      case "network":
        return <Network {...props} />
      case "newspaper":
        return <Newspaper {...props} />
      case "octagon":
        return <Octagon {...props} />
      case "orange":
        return <Orange {...props} />
      case "orbit":
        return <Orbit {...props} />
      case "palette":
        return <Palette {...props} />
      case "palmtree":
        return <PalmTree {...props} />
      case "pause":
        return <Pause {...props} />
      case "pawprint":
        return <PawPrint {...props} />
      case "pen":
        return <Pen {...props} />
      case "pencil":
        return <Pencil {...props} />
      case "personstanding":
        return <PersonStanding {...props} />
      case "phonecall":
        return <PhoneCall {...props} />
      case "phoneforwarded":
        return <PhoneForwarded {...props} />
      case "phoneincoming":
        return <PhoneIncoming {...props} />
      case "phonemissed":
        return <PhoneMissed {...props} />
      case "phoneoff":
        return <PhoneOff {...props} />
      case "phoneoutgoing":
        return <PhoneOutgoing {...props} />
      case "pictureinpicture":
        return <PictureInPicture {...props} />
      case "piggybank":
        return <PiggyBank {...props} />
      case "pin":
        return <Pin {...props} />
      case "pizza":
        return <Pizza {...props} />
      case "plane":
        return <Plane {...props} />
      case "play":
        return <Play {...props} />
      case "plug":
        return <Plug {...props} />
      case "plugzap":
        return <PlugZap {...props} />
      case "podcast":
        return <Podcast {...props} />
      case "power":
        return <Power {...props} />
      case "puzzle":
        return <Puzzle {...props} />
      case "qrcode":
        return <QrCode {...props} />
      case "quote":
        return <Quote {...props} />
      case "radio":
        return <Radio {...props} />
      case "rainbow":
        return <Rainbow {...props} />
      case "receipt":
        return <Receipt {...props} />
      case "recycle":
        return <Recycle {...props} />
      case "refrigerator":
        return <Refrigerator {...props} />
      case "rocket":
        return <Rocket {...props} />
      case "rockingchair":
        return <RockingChair {...props} />
      case "sandwich":
        return <Sandwich {...props} />
      case "satellite":
        return <Satellite {...props} />
      case "scale":
        return <Scale {...props} />
      case "scan":
        return <Scan {...props} />
      case "school":
        return <School {...props} />
      case "screenshare":
        return <ScreenShare {...props} />
      case "server":
        return <Server {...props} />
      case "ship":
        return <Ship {...props} />
      case "shirt":
        return <Shirt {...props} />
      case "shovel":
        return <Shovel {...props} />
      case "shower":
        return <Shower {...props} />
      case "shrub":
        return <Shrub {...props} />
      case "shuffle":
        return <Shuffle {...props} />
      case "sigma":
        return <Sigma {...props} />
      case "signal":
        return <Signal {...props} />
      case "skull":
        return <Skull {...props} />
      case "sliders":
        return <Sliders {...props} />
      case "snowflake":
        return <Snowflake {...props} />
      case "sofa":
        return <Sofa {...props} />
      case "soup":
        return <Soup {...props} />
      case "speaker":
        return <Speaker {...props} />
      case "spline":
        return <Spline {...props} />
      case "stethoscope":
        return <Stethoscope {...props} />
      case "sticker":
        return <Sticker {...props} />
      case "stickynote":
        return <StickyNote {...props} />
      case "stopcircle":
        return <StopCircle {...props} />
      case "store":
        return <Store {...props} />
      case "stretchhorizontal":
        return <StretchHorizontal {...props} />
      case "stretchvertical":
        return <StretchVertical {...props} />
      case "strikethrough":
        return <Strikethrough {...props} />
      case "subscript":
        return <Subscript {...props} />
      case "subtitles":
        return <Subtitles {...props} />
      case "sunrise":
        return <Sunrise {...props} />
      case "sunset":
        return <Sunset {...props} />
      case "superscript":
        return <Superscript {...props} />
      case "swissfranc":
        return <SwissFranc {...props} />
      case "sword":
        return <Sword {...props} />
      case "swords":
        return <Swords {...props} />
      case "table":
        return <Table {...props} />
      case "target":
        return <Target {...props} />
      case "tent":
        return <Tent {...props} />
      case "terminal":
        return <Terminal {...props} />
      case "thermometersnowflake":
        return <ThermometerSnowflake {...props} />
      case "thermometersun":
        return <ThermometerSun {...props} />
      case "ticket":
        return <Ticket {...props} />
      case "timer":
        return <Timer {...props} />
      case "timeroff":
        return <TimerOff {...props} />
      case "toggleleft":
        return <ToggleLeft {...props} />
      case "toggleright":
        return <ToggleRight {...props} />
      case "tornado":
        return <Tornado {...props} />
      case "tractor":
        return <Tractor {...props} />
      case "trafficcone":
        return <TrafficCone {...props} />
      case "train":
        return <Train {...props} />
      case "treedeciduous":
        return <TreeDeciduous {...props} />
      case "treepine":
        return <TreePine {...props} />
      case "trophy":
        return <Trophy {...props} />
      case "tv":
        return <Tv {...props} />
      case "tv2":
        return <Tv2 {...props} />
      case "twitch":
        return <Twitch {...props} />
      case "twitter":
        return <Twitter {...props} />
      case "type":
        return <Type {...props} />
      case "undo":
        return <Undo {...props} />
      case "unlink":
        return <Unlink {...props} />
      case "usbstick":
        return <UsbStick {...props} />
      case "usercheck":
        return <UserCheck {...props} />
      case "usercog":
        return <UserCog {...props} />
      case "userminus":
        return <UserMinus {...props} />
      case "userplus":
        return <UserPlus {...props} />
      case "userx":
        return <UserX {...props} />
      case "utensilscrossed":
        return <UtensilsCrossed {...props} />
      case "variable":
        return <Variable {...props} />
      case "vegan":
        return <Vegan {...props} />
      case "videooff":
        return <VideoOff {...props} />
      case "view":
        return <View {...props} />
      case "voicemail":
        return <Voicemail {...props} />
      case "volume":
        return <Volume {...props} />
      case "volume1":
        return <Volume1 {...props} />
      case "volume2":
        return <Volume2 {...props} />
      case "volumex":
        return <VolumeX {...props} />
      case "wallet":
        return <Wallet {...props} />
      case "wand":
        return <Wand {...props} />
      case "watch":
        return <Watch {...props} />
      case "waves":
        return <Waves {...props} />
      case "webcam":
        return <Webcam {...props} />
      case "wifioff":
        return <WifiOff {...props} />
      case "wine":
        return <Wine {...props} />
      case "workflow":
        return <Workflow {...props} />
      case "wrench":
        return <Wrench {...props} />
      case "xoctagon":
        return <XOctagon {...props} />
      case "xsquare":
        return <XSquare {...props} />
      case "youtube":
        return <Youtube {...props} />
      case "zapoff":
        return <ZapOff {...props} />
      case "zoomin":
        return <ZoomIn {...props} />
      case "zoomout":
        return <ZoomOut {...props} />

      // 默认图标
      default:
        return <Star {...props} />
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        style={{
          fontSize: Math.min(element.width, element.height) / 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {renderIcon()}
      </div>
    </div>
  )
}

