
import { IAllRatings, IAllVendorsBanner, IAllVendorsImageBottomTag, IAllVendorsProps, ICartCardProps, IProductCardProps, Iimage, ISingleVendorBanner, IOrderReceipt, IMultipleForms } from "@/types/user";


const Banner: Iimage[] = [
    {
        id: 1,
        imageSrc: 'https://images.pexels.com/photos/16940647/pexels-photo-16940647/free-photo-of-t-shirts-hanging-on-hangers.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Replace with your image URL
        imageAlt: 'Image1',
        title: 'Men Fashion',
        subtitle: 'Always looking fresh',
        littleText: 'Be a gentleman'
    },
    {
        id: 2,
        imageSrc: 'https://images.pexels.com/photos/8148576/pexels-photo-8148576.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Image2',
        title: 'Women Fashio',
        subtitle: 'My type of lady',
        littleText: 'Ypu are beautiful'
    },
    {
        id: 3,
        imageSrc: 'https://images.pexels.com/photos/5746087/pexels-photo-5746087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Image2',
        title: 'KIDS Fashio',
        subtitle: 'My kids my future',
        littleText: 'Be a smart parent'
    }
];


const ProductBanner: Iimage[] = [
    {
        id: 1,
        imageSrc: 'https://images.pexels.com/photos/16940647/pexels-photo-16940647/free-photo-of-t-shirts-hanging-on-hangers.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Replace with your image URL
        imageAlt: 'Image1',
        title: 'Men Fashion',
        subtitle: 'Always looking fresh',
        littleText: 'Be a gentleman'
    },
    {
        id: 2,
        imageSrc: 'https://images.pexels.com/photos/8148576/pexels-photo-8148576.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Image2',
        title: 'Women Fashio',
        subtitle: 'My type of lady',
        littleText: 'Ypu are beautiful'
    },
    {
        id: 3,
        imageSrc: 'https://images.pexels.com/photos/5746087/pexels-photo-5746087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Image2',
        title: 'KIDS Fashio',
        subtitle: 'My kids my future',
        littleText: 'Be a smart parent'
    }
];


const HomeProductsLists: IProductCardProps[] = [
    {
        id: 1,
        names: 'Seating Chair',
        price: 48,
        imageUrl: 'https://images.pexels.com/photos/8082560/pexels-photo-8082560.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Tall slender porcelain bottle with natural clay textured body and cork stopper.',
        width: 120,
        height: 120,
    },
    {
        id: 2,
        names: 'Adidad Footwear',
        price: 35,
        imageUrl: 'https://images.pexels.com/photos/6531405/pexels-photo-6531405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Olive drab green insulated bottle with flared screw lid and flat top.',
        width: 300,
        height: 350,
    },
    {
        id: 3,
        names: 'Nike Footwear',
        price: 89,
        imageUrl: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Person using a pen to cross a task off a productivity paper card.',
        width: 300,
        height: 350,
    },
    {
        id: 4,
        names: 'Adidas T-Shirt',
        price: 35,
        imageUrl: 'https://images.pexels.com/photos/10371090/pexels-photo-10371090.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Hand holding black machined steel mechanical pencil with brass tip and top.',
        width: 300,
        height: 350,
    },
    {
        id: 5,
        names: 'Nike Footwear',
        price: 35,
        imageUrl: 'https://images.pexels.com/photos/13457480/pexels-photo-13457480.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Hand holding black machined steel mechanical pencil with brass tip and top.',
        width: 300,
        height: 350,
    }, {
        id: 6,
        names: 'Adidad Footwear',
        price: 35,
        imageUrl: 'https://images.pexels.com/photos/6531405/pexels-photo-6531405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Olive drab green insulated bottle with flared screw lid and flat top.',
        width: 300,
        height: 350,
    },
    {
        id: 7,
        names: 'Nike Footwear',
        price: 89,
        imageUrl: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Person using a pen to cross a task off a productivity paper card.',
        width: 300,
        height: 350,
    },
    // More products...
];

const BuyAbleProps: Iimage[] = [
    {
        id: 1,
        imageSrc: 'https://images.pexels.com/photos/16940647/pexels-photo-16940647/free-photo-of-t-shirts-hanging-on-hangers.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Replace with your image URL
        imageAlt: 'Image1',
        title: 'Men Fashion',
        subtitle: 'Always looking fresh',
        littleText: 'Be a gentleman'
    },
    {
        id: 2,
        imageSrc: 'https://images.pexels.com/photos/8148576/pexels-photo-8148576.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Image2',
        title: 'Women Fashio',
        subtitle: 'My type of lady',
        littleText: 'Ypu are beautiful'
    },
    {
        id: 3,
        imageSrc: 'https://images.pexels.com/photos/5746087/pexels-photo-5746087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Image2',
        title: 'KIDS Fashio',
        subtitle: 'My kids my future',
        littleText: 'Be a smart parent'
    }
];



const ProductsHomePagesItems: IProductCardProps[] = [
    {
        id: 1,
        names: 'Product-Page 01',
        price: 48,
        imageUrl: 'https://images.pexels.com/photos/8082560/pexels-photo-8082560.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Tall slender porcelain bottle with natural clay textured body and cork stopper.',
        width: 300,
        height: 350,
    },
    {
        id: 2,
        names: 'Product-Page 02',
        price: 35,
        imageUrl: 'https://images.pexels.com/photos/6531405/pexels-photo-6531405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Olive drab green insulated bottle with flared screw lid and flat top.',
        width: 300,
        height: 350,
    },
    {
        id: 3,
        names: 'Product-Page 03',
        price: 89,
        imageUrl: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Person using a pen to cross a task off a productivity paper card.',
        width: 300,
        height: 350,
    },
    {
        id: 4,
        names: 'Product-Page 04',
        price: 35,
        imageUrl: 'https://images.pexels.com/photos/10371090/pexels-photo-10371090.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Hand holding black machined steel mechanical pencil with brass tip and top.',
        width: 300,
        height: 350,
    },
    {
        id: 5,
        names: 'Product-Page 05',
        price: 35,
        imageUrl: 'https://images.pexels.com/photos/13457480/pexels-photo-13457480.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Hand holding black machined steel mechanical pencil with brass tip and top.',
        width: 300,
        height: 350,
    },
    {
        id: 6,
        names: 'Product-Page 06',
        price: 48,
        imageUrl: 'https://images.pexels.com/photos/8082560/pexels-photo-8082560.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Tall slender porcelain bottle with natural clay textured body and cork stopper.',
        width: 300,
        height: 350,
    },
    {
        id: 7,
        names: 'Product-Page 07',
        price: 35,
        imageUrl: 'https://images.pexels.com/photos/6531405/pexels-photo-6531405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Olive drab green insulated bottle with flared screw lid and flat top.',
        width: 300,
        height: 350,
    },
    {
        id: 8,
        names: 'Product-Page 08',
        price: 89,
        imageUrl: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Person using a pen to cross a task off a productivity paper card.',
        width: 300,
        height: 350,
    },
    {
        id: 9,
        names: 'Product-Page 09',
        price: 35,
        imageUrl: 'https://images.pexels.com/photos/10371090/pexels-photo-10371090.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Hand holding black machined steel mechanical pencil with brass tip and top.',
        width: 300,
        height: 350,
    },
    {
        id: 10,
        names: 'Product-Page 10',
        price: 35,
        imageUrl: 'https://images.pexels.com/photos/13457480/pexels-photo-13457480.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Hand holding black machined steel mechanical pencil with brass tip and top.',
        width: 300,
        height: 350,
    }
    // More products...
];


const images: Iimage[] = [
    {
        id: 1,
        imageSrc: 'https://images.pexels.com/photos/8764560/pexels-photo-8764560.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Replace with your image URL
        imageAlt: 'Image1',
        width: 300,
        height: 200,
    },
    {
        id: 2,
        imageSrc: 'https://images.pexels.com/photos/12725050/pexels-photo-12725050.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Image2',
        width: 300,
        height: 200,
    },
    {
        id: 3,
        imageSrc: 'https://images.pexels.com/photos/8830049/pexels-photo-8830049.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Image2',
        width: 300,
        height: 200,
    },
    {
        id: 4,
        imageSrc: 'https://images.pexels.com/photos/9281229/pexels-photo-9281229.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Image2',
        width: 300,
        height: 200,
    },
    {
        id: 5,
        imageSrc: 'https://images.pexels.com/photos/12725050/pexels-photo-12725050.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Image2',
        width: 300,
        height: 200,
    },
    {
        id: 3,
        imageSrc: 'https://images.pexels.com/photos/8830049/pexels-photo-8830049.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Image2',
        width: 300,
        height: 200,
    },
    {
        id: 4,
        imageSrc: 'https://images.pexels.com/photos/9281229/pexels-photo-9281229.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Image2',
        width: 300,
        height: 200,
    },

];

const HomeAnimationimages: Iimage[] = [
    {
        id: 1,
        imageSrc: 'https://images.pexels.com/photos/2622187/pexels-photo-2622187.jpeg', // Replace with your image URL
        imageAlt: 'Image1',
        width: 300,
        height: 200,
    },
    {
        id: 2,
        imageSrc: 'https://images.pexels.com/photos/6613042/pexels-photo-6613042.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Image2',
        width: 300,
        height: 200,
    },
    {
        id: 3,
        imageSrc: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Image2',
        width: 300,
        height: 200,
    },
    {
        id: 4,
        imageSrc: 'https://images.pexels.com/photos/5413288/pexels-photo-5413288.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Image2',
        width: 300,
        height: 200,
    },
    {
        id: 5,
        imageSrc: 'https://images.pexels.com/photos/6531405/pexels-photo-6531405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Image2',
        width: 300,
        height: 200,
    },
    {
        id: 6,
        imageSrc: 'https://images.pexels.com/photos/5413288/pexels-photo-5413288.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Image2',
        width: 300,
        height: 200,
    },
    {
        id: 7,
        imageSrc: 'https://images.pexels.com/photos/6531405/pexels-photo-6531405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Image2',
        width: 300,
        height: 200,
    }

];


const HomePageAdidas: Iimage[] = [
    {
        id: 1,
        imageSrc: 'https://images.pexels.com/photos/1192601/pexels-photo-1192601.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Replace with your image URL
        imageAlt: 'Image1',
        width: 300,
        height: 200,
    },
    {
        id: 2,
        imageSrc: 'https://images.pexels.com/photos/6531405/pexels-photo-6531405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Image2',
        width: 300,
        height: 200,
    },
    {
        id: 3,
        imageSrc: 'https://images.pexels.com/photos/13457480/pexels-photo-13457480.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Image2',
        width: 300,
        height: 200,
    },
    {
        id: 4,
        imageSrc: 'https://images.pexels.com/photos/18439588/pexels-photo-18439588/free-photo-of-smiling-man-in-t-shirt-sitting.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Image2',
        width: 300,
        height: 200,
    },
    {
        id: 5,
        imageSrc: 'https://images.pexels.com/photos/5413288/pexels-photo-5413288.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Image2',
        width: 300,
        height: 200,
    }, {
        id: 6,
        imageSrc: 'https://images.pexels.com/photos/6531405/pexels-photo-6531405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Image2',
        width: 300,
        height: 200,
    },
    {
        id: 7,
        imageSrc: 'https://images.pexels.com/photos/13457480/pexels-photo-13457480.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Image2',
        width: 300,
        height: 200,
    },

];

const HomePageNike: Iimage[] = [
    {
        id: 1,
        imageSrc: 'https://images.pexels.com/photos/1972115/pexels-photo-1972115.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Replace with your image URL
        imageAlt: 'Image1',
        width: 300,
        height: 200,
    },
    {
        id: 2,
        imageSrc: 'https://images.pexels.com/photos/1306248/pexels-photo-1306248.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Image2',
        width: 300,
        height: 200,
    },
    {
        id: 3,
        imageSrc: 'https://images.pexels.com/photos/2529147/pexels-photo-2529147.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Image2',
        width: 300,
        height: 200,
    },
    {
        id: 4,
        imageSrc: 'https://images.pexels.com/photos/13236691/pexels-photo-13236691.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Image2',
        width: 300,
        height: 200,
    },
    {
        id: 5,
        imageSrc: 'https://images.pexels.com/photos/13236690/pexels-photo-13236690.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Image2',
        width: 300,
        height: 200,
    },
    {
        id: 6,
        imageSrc: 'https://images.pexels.com/photos/1306248/pexels-photo-1306248.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Image2',
        width: 300,
        height: 200,
    },
    {
        id: 7,
        imageSrc: 'https://images.pexels.com/photos/2529147/pexels-photo-2529147.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        imageAlt: 'Image2',
        width: 300,
        height: 200,
    }

];

const navigation = [
    {
        title: "LET US HELP YOU",
        links: [
            { title: 'Help center', url:'/' },
            { title: 'Contact us', url:'/' },
            { title: 'How to shop on Bulq', url:'/' },
            { title: 'How to return on Bulq', url:'/' },
            { title: 'Policy and Privacy', url:'/' },
            { title: 'Shipping', url:'/' },
        ],
    },
    {
        title: "ABOUT US",
        links: [
            { title: 'About us', url:'/' },
            { title: 'Bulq deals', url:'/' },
            { title: 'Bulq discounts', url:'/' },
            { title: 'Bulq festival', url:'/' },
            { title: 'Terms and agreement', url:'/' },
            { title: 'Locations', url:'/' },
        ],
    },
    {
        title: "MAKE MONEY WITH BULQ",
        links: [
            { title: 'Become a seller', url:'/' },
            { title: 'Become a sales representatives', url:'/' },
            { title: 'Become an ambassador',  url:'/' },
            { title: 'Discount sales',  url:'/' },
            { title: 'Become a logistics partner',  url:'/' },
            { title: 'Become a service Provider',  url:'/' },
        ]
    },
   {
        title: "BULQ INTERNATIONAL",
        links: [
            { title: 'Canada',  url:'/' },
            { title: 'United State',  url:'/' },
            { title: 'Dubai',  url:'/' },
            { title: 'South Africa',  url:'/' },
            { title: 'Nigeria',  url:'/' },
            { title: 'Ghana',  url:'/' },
        ]

    },
]
const social= [
    {
        name: 'Facebook',
        href: '#', 
    },
    {
        name: 'Instagram',
        href: '#',
    },
    {
        name: 'Twitter',
        href: '#',
        
    },
    {
        name: 'GitHub',
        href: '#',
    
    },
    {
        name: 'YouTube',
        href: '#',
       
    },
]


const CartImageHolder: ICartCardProps[] = [
    {
        id: 1,
        img: "https://images.pexels.com/photos/923192/pexels-photo-923192.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        product: "One Seater Sofa with Quality and Premium Cotton",
        brand: "Nike/Similar Product from Nike",
        colors: [
            {
                color: "#669FCD",
                price: 5,
            },
            {
                color: "#6C6938",
                price: 8,
            },
            {
                color: "#495855",
                price: 10,
            },
            {
                color: "#003E4D",
                price: 12,
            },
        ],
        price: 400,
        rating: 600,
        shipping: 20,
        vendor: "Ali Express",//bulq_website/public/images/bulq.png
        size: [
            {
                title: 'S'
            },
            {
                title: 'M'
            },
            {
                title: 'L'
            },
            {
                title: 'XL'
            },
            {
                title: 'XXL'
            },
            {
                title: 'XXXL'
            },
        ],
        desc: "Ashanti Brown Bag is your best Carrier made from one of the finest Leather. High Durability, Easy to clean, Last for more than an annum.",
        features: [
            {
                feature: "Neat and Strong stitches",
            },
            {
                feature: "Affordable",
            },
            {
                feature: "Two compartment for storage",
            },
            {
                feature: "Lightweight",
            },
            {
                feature: "Perfect for holding laptop",
            },
            {
                feature: "Perfect Quality Zipper",
            },
        ],
        images: [
            {
                image: 'https://images.pexels.com/photos/6580416/pexels-photo-6580416.jpeg?auto=compress&cs=tinysrgb&w=800'
            },
            {
                image: 'https://images.pexels.com/photos/1239298/pexels-photo-1239298.jpeg?auto=compress&cs=tinysrgb&w=800'
            },
            {
                image: 'https://images.pexels.com/photos/4846087/pexels-photo-4846087.jpeg?auto=compress&cs=tinysrgb&w=800'
            },
            {
                image: 'https://images.pexels.com/photos/2986011/pexels-photo-2986011.jpeg?auto=compress&cs=tinysrgb&w=800'
            },
            {
                image: 'https://images.pexels.com/photos/6588592/pexels-photo-6588592.jpeg?auto=compress&cs=tinysrgb&w=800'
            },
            {
                image: 'https://images.pexels.com/photos/3621486/pexels-photo-3621486.jpeg?auto=compress&cs=tinysrgb&w=800'
            },
        ],
        Material: "Leather",
        Model: "P80",
        Weight: "2kg",
    },
    {
        id: 2,
        img: "https://images.pexels.com/photos/3178938/pexels-photo-3178938.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        product: "Ashanti 100% Quality Brown bag",
        brand: "Ashanti/Similar quality from Ashanti",
        colors: [
            {
                color: "#669FCD",
                price: 5,
            },
            {
                color: "#6C6938",
                price: 8,
            },
            {
                color: "#495855",
                price: 10,
            },
            {
                color: "#003E4D",
                price: 12,
            },
        ],
        price: 800,
        rating: 600,
        shipping: 20,
        vendor: "Ashanti",
        size: [
            {
                title: 'S'
            },
            {
                title: 'M'
            },
            {
                title: 'L'
            },
            {
                title: 'XL'
            },
            {
                title: 'XXL'
            },
            {
                title: 'XXXL'
            },
        ],
    },
    {
        id: 3,
        img: "https://images.pexels.com/photos/157888/fashion-glasses-go-pro-female-157888.jpeg?auto=compress&cs=tinysrgb&w=800",
        product: "Premium Elite Fabric From Valentino",
        brand: "Valentino/Similar quality from Valentino",
        colors: [
            {
                color: "#669FCD",
                price: 5,
            },
            {
                color: "#6C6938",
                price: 8,
            },
            {
                color: "#495855",
                price: 10,
            },
            {
                color: "#003E4D",
                price: 12,
            },
        ],
        price: 900,
        rating: 650,
        shipping: 20,
        vendor: "Valentino",
        size: [
            {
                title: 'S'
            },
            {
                title: 'M'
            },
            {
                title: 'L'
            },
            {
                title: 'XL'
            },
            {
                title: 'XXL'
            },
            {
                title: 'XXXL'
            },
        ],
        desc: "Ashanti Brown Bag is your best Carrier made from one of the finest Leather. High Durability, Easy to clean, Last for more than an annum.",
        features: [
            {
                feature: "Neat and Strong stitches",
            },
            {
                feature: "Affordable",
            },
            {
                feature: "Two compartment for storage",
            },
            {
                feature: "Lightweight",
            },
            {
                feature: "Perfect for holding laptop",
            },
            {
                feature: "Perfect Quality Zipper",
            },
        ],
        images: [
            {
                image: 'https://images.pexels.com/photos/6580416/pexels-photo-6580416.jpeg?auto=compress&cs=tinysrgb&w=800'
            },
            {
                image: 'https://images.pexels.com/photos/1239298/pexels-photo-1239298.jpeg?auto=compress&cs=tinysrgb&w=800'
            },
            {
                image: 'https://images.pexels.com/photos/4846087/pexels-photo-4846087.jpeg?auto=compress&cs=tinysrgb&w=800'
            },
            {
                image: 'https://images.pexels.com/photos/2986011/pexels-photo-2986011.jpeg?auto=compress&cs=tinysrgb&w=800'
            },
            {
                image: 'https://images.pexels.com/photos/6588592/pexels-photo-6588592.jpeg?auto=compress&cs=tinysrgb&w=800'
            },
            {
                image: 'https://images.pexels.com/photos/3621486/pexels-photo-3621486.jpeg?auto=compress&cs=tinysrgb&w=800'
            },
        ],
        Material: "Leather",
        Model: "P80",
        Weight: "2kg",
    },
    {
        id: 4,
        img: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800",
        product: "Prada World",
        brand: "Prada/Similar Quality from Prada",
        colors: [
            {
                color: "#669FCD",
                price: 5,
            },
            {
                color: "#6C6938",
                price: 8,
            },
            {
                color: "#495855",
                price: 10,
            },
            {
                color: "#003E4D",
                price: 12,
            },
        ],
        price: 700,
        rating: 400,
        shipping: 20,
        vendor: "Prada",
        size: [
            {
                title: 'S'
            },
            {
                title: 'M'
            },
            {
                title: 'L'
            },
            {
                title: 'XL'
            },
            {
                title: 'XXL'
            },
            {
                title: 'XXXL'
            },
        ],
        desc: "Ashanti Brown Bag is your best Carrier made from one of the finest Leather. High Durability, Easy to clean, Last for more than an annum.",
        features: [
            {
                feature: "Neat and Strong stitches",
            },
            {
                feature: "Affordable",
            },
            {
                feature: "Two compartment for storage",
            },
            {
                feature: "Lightweight",
            },
            {
                feature: "Perfect for holding laptop",
            },
            {
                feature: "Perfect Quality Zipper",
            },
        ],
        images: [
            {
                image: 'https://images.pexels.com/photos/6580416/pexels-photo-6580416.jpeg?auto=compress&cs=tinysrgb&w=800'
            },
            {
                image: 'https://images.pexels.com/photos/1239298/pexels-photo-1239298.jpeg?auto=compress&cs=tinysrgb&w=800'
            },
            {
                image: 'https://images.pexels.com/photos/4846087/pexels-photo-4846087.jpeg?auto=compress&cs=tinysrgb&w=800'
            },
            {
                image: 'https://images.pexels.com/photos/2986011/pexels-photo-2986011.jpeg?auto=compress&cs=tinysrgb&w=800'
            },
            {
                image: 'https://images.pexels.com/photos/6588592/pexels-photo-6588592.jpeg?auto=compress&cs=tinysrgb&w=800'
            },
            {
                image: 'https://images.pexels.com/photos/3621486/pexels-photo-3621486.jpeg?auto=compress&cs=tinysrgb&w=800'
            },
        ],
        Material: "Leather",
        Model: "P80",
        Weight: "2kg",
    },
    {
        id: 5,
        img: "https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        product: "Rock your T-Shirt in the Gucci culture",
        brand: "Gucci/Similar quality from Gucci",
        colors: [
            {
                color: "#669FCD",
                price: 5,
            },
            {
                color: "#6C6938",
                price: 8,
            },
            {
                color: "#495855",
                price: 10,
            },
            {
                color: "#003E4D",
                price: 12,
            },
        ],
        price: 600,
        rating: 800,
        shipping: 20,
        vendor: "Gucci",
        size: [
            {
                title: 'S'
            },
            {
                title: 'M'
            },
            {
                title: 'L'
            },
            {
                title: 'XL'
            },
            {
                title: 'XXL'
            },
            {
                title: 'XXXL'
            },
        ],
        desc: "Ashanti Brown Bag is your best Carrier made from one of the finest Leather. High Durability, Easy to clean, Last for more than an annum.",
        features: [
            {
                feature: "Neat and Strong stitches",
            },
            {
                feature: "Affordable",
            },
            {
                feature: "Two compartment for storage",
            },
            {
                feature: "Lightweight",
            },
            {
                feature: "Perfect for holding laptop",
            },
            {
                feature: "Perfect Quality Zipper",
            },
        ],
        images: [
            {
                image: 'https://images.pexels.com/photos/6580416/pexels-photo-6580416.jpeg?auto=compress&cs=tinysrgb&w=800'
            },
            {
                image: 'https://images.pexels.com/photos/1239298/pexels-photo-1239298.jpeg?auto=compress&cs=tinysrgb&w=800'
            },
            {
                image: 'https://images.pexels.com/photos/4846087/pexels-photo-4846087.jpeg?auto=compress&cs=tinysrgb&w=800'
            },
            {
                image: 'https://images.pexels.com/photos/2986011/pexels-photo-2986011.jpeg?auto=compress&cs=tinysrgb&w=800'
            },
            {
                image: 'https://images.pexels.com/photos/6588592/pexels-photo-6588592.jpeg?auto=compress&cs=tinysrgb&w=800'
            },
            {
                image: 'https://images.pexels.com/photos/3621486/pexels-photo-3621486.jpeg?auto=compress&cs=tinysrgb&w=800'
            },
        ],
        Material: "Leather",
        Model: "P80",
        Weight: "2kg",

    },

];

const VendorDescHolder: IAllVendorsProps[] =[
    {
        id: 1,
        image: '/images/allvendors/walmartlogo.png',
        link: 'allvendors/walmart',
        name: 'Walmart',
    },
    {
        id: 2,
        image: '/images/allvendors/chicmelogo.png',
        link: 'allvendors/chicme',
        name: 'Chicme',
    },
    {
        id: 3,
        image: '/images/allvendors/addidaslogo.png',
        link: 'allvendors/addidas',
        name: 'Addidas',
    },
    {
        id: 4,
        image: '/images/allvendors/nikelogo.png',
        link: 'allvendors/nike',
        name: 'Nike',
    },
    {
        id: 5,
        image: '/images/allvendors/amazonlogo.png',
        link: 'allvendors/amazon',
        name: 'Amazon',
    },
    {
        id: 6,
        image: '/images/allvendors/patpatlogo.png',
        link: 'allvendors/patpat',
        name: 'Patpat',
    },
    {
        id: 7,
        image: '/images/allvendors/ebaylogo.png',
        link: 'allvendors/aliexpress',
        name: 'AliExpress',
    },
    {
        id: 8,
        image: '/images/allvendors/aliexpresslogo.png',
        link: 'allvendors/walmart',
        name: 'walmart',
    },
    {
        id: 9,
        image: '/images/allvendors/targetlogo.png',
        link: 'allvendors/target',
        name: 'Target',
    },
    {
        id: 10,
        image: '/images/allvendors/macdonaldslogo.png',
        link: 'allvendors/macdonalds',
        name: 'MacDonalds',
    },
    {
        id: 11,
        image: '/images/allvendors/supremelogo.png',
        link: 'allvendors/supreme',
        name: 'Supreme',
    },
    {
        id: 12,
        image: '/images/allvendors/nblogo.png',
        link: 'allvendors/nb',
        name: 'NB',
    },
    {
        id: 13,
        image: '/images/allvendors/boomplaylogo.png',
        link: 'allvendors/boom',
        name: 'Boom',
    },
    {
        id: 14,
        image: 'https://images.pexels.com/photos/5650017/pexels-photo-5650017.jpeg?auto=compress&cs=tinysrgb&w=500&h=450&dpr=2',
        link: 'allvendorsonsales',
        name: 'All Vendors On sales',
    },
]

const VendorOnSalesDescHolder: IAllVendorsProps[] =[
    {
        id: 1,
        image: '/images/allvendors/walmartlogo.png',
        link: 'allvendorsonsales/walmart',
        name: 'Walmart',
    },
    {
        id: 2,
        image: '/images/allvendors/chicmelogo.png',
        link: 'allvendorsonsales/chicme',
        name: 'Chicme',
    },
    {
        id: 3,
        image: '/images/allvendors/addidaslogo.png',
        link: 'allvendorsonsales/addidas',
        name: 'Addidas',
    },
    {
        id: 4,
        image: '/images/allvendors/nikelogo.png',
        link: 'allvendorsonsales/nike',
        name: 'Nike',
    },
    {
        id: 5,
        image: '/images/allvendors/amazonlogo.png',
        link: 'allvendorsonsales/amazon',
        name: 'Amazon',
    },
    {
        id: 6,
        image: '/images/allvendors/patpatlogo.png',
        link: 'allvendorsonsales/patpat',
        name: 'Patpat',
    },
    {
        id: 7,
        image: '/images/allvendors/ebaylogo.png',
        link: 'allvendorsonsales/aliexpress',
        name: 'AliExpress',
    },
    {
        id: 8,
        image: '/images/allvendors/aliexpresslogo.png',
        link: 'allvendorsonsales/walmart',
        name: 'walmart',
    },
    {
        id: 9,
        image: '/images/allvendors/targetlogo.png',
        link: 'allvendorsonsales/target',
        name: 'Target',
    },
    {
        id: 10,
        image: '/images/allvendors/macdonaldslogo.png',
        link: 'allvendorsonsales/macdonalds',
        name: 'MacDonalds',
    },
    {
        id: 11,
        image: '/images/allvendors/supremelogo.png',
        link: 'allvendorsonsales/supreme',
        name: 'Supreme',
    },
    {
        id: 12,
        image: '/images/allvendors/nblogo.png',
        link: 'allvendorsonsales/nb',
        name: 'NB',
    },
    {
        id: 13,
        image: '/images/allvendors/boomplaylogo.png',
        link: 'allvendorsonsales/boom',
        name: 'Boom',
    },
]

const VendorsBanner: IAllVendorsBanner = {
    image: '/images/allvendors/weight.png',
    desc: 'The shopping experience with all the feels and thrills.',
    small: 'All discounts and rewards, one tap.',
}

const SingleVendorBanner: ISingleVendorBanner = {
    image: '/images/allvendors/nikebanner.png',
    desc: 'Nike',
    big: 'DISCOUNT ON NIKE',
    small: 'JUST DO IT!!!',
}

const VenorsTags: IAllVendorsImageBottomTag[] = [
    {
        id: 1,
        desc: 'BULQ FOOD',
        image: '/images/allvendors/foodtag.png',
        predesc: 'SHOP OUR',
    },
    {
        id: 2,
        desc: 'MOST SHOPPED',
        image: '/images/allvendors/fashiontag.png',
        predesc: 'VIEW OUR',
    },
    {
        id: 3,
        desc: 'PRODUCT',
        image: '/images/allvendors/skincaretag.png',
        predesc: 'LATEST',
    },
]

const Reviews : IAllRatings[] = [
    {
        id: 1,
        image: 'https://images.pexels.com/photos/3454298/pexels-photo-3454298.jpeg?auto=compress&cs=tinysrgb&w=800',
        comment: 'I really love shopping here',
        rating: 5,
    },
    {
        id: 2,
        image: 'https://images.pexels.com/photos/4307869/pexels-photo-4307869.jpeg?auto=compress&cs=tinysrgb&w=800',
        comment: 'Its breezy cool shopping here.',
        rating: 5,
    },
    {
        id: 3,
        image: 'https://images.pexels.com/photos/7116213/pexels-photo-7116213.jpeg?auto=compress&cs=tinysrgb&w=800',
        comment: 'Ice fresh and really super convenient',
        rating: 4,
    },
    {
        id: 4,
        image: 'https://images.pexels.com/photos/7171858/pexels-photo-7171858.jpeg?auto=compress&cs=tinysrgb&w=800',
        comment: 'Id recommend this website to my peeps ASAP!!',
        rating: 3,
    },
    {
        id: 5,
        image: 'https://images.pexels.com/photos/5792641/pexels-photo-5792641.jpeg?auto=compress&cs=tinysrgb&w=800',
        comment: 'Getting my groceries on this store bookmarked.',
        rating: 5,
    },
    {
        id: 6,
        image: 'https://images.pexels.com/photos/8090137/pexels-photo-8090137.jpeg?auto=compress&cs=tinysrgb&w=800',
        comment: 'breezy, i procure services all the way from kenya',
        rating: 5,
    },
    {
        id: 7,
        image: 'https://images.pexels.com/photos/8993561/pexels-photo-8993561.jpeg?auto=compress&cs=tinysrgb&w=800',
        comment: 'Fantastic website, saving up to get my PS5 on here',
        rating: 5,
    },
    {
        id: 8,
        image: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=800',
        comment: 'Marvellous user experience.',
        rating: 4,
    },
]

const receipt: IOrderReceipt = {
    logo: '/images/bulq.png',
    date: '22/09/2022',
    receiptNumber: '23232333h',
    name: 'GQ',
    message: 'Thank you for shopping with us at BULQ your order Brown Bag and  one other items.we will send a confirmation when your item ships. we hope to see you again soon...',
    productInfo: [
        {
            image: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            name: 'Ashanti QualityBrown Bag   X2',
            paid: 'PAID',
            price: 1600,
        },
        {
            image: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            name: 'completeRoadman  x1',
            paid: 'PAID',
            price: 500,
        },
    ],
    address: '12 Teacher street, Ikorodu, Lagos',
    paymentMethod: 'Google Pay',
    itemSubtotal: 2100,
    shippingFee: 100,
    totalOverall: 2200,
}

// const socialMediaData: SocialMediaItem[] = [
//   {
//     id: 1,
//     platform: 'Twitter',
//     username: 'example_twitter',
//     url: 'https://twitter.com/example_twitter',
//   },
//   {
//     id: 2,
//     platform: 'Instagram',
//     username: 'example_instagram',
//     url: 'https://cdn-icons-png.flaticon.com/512/2111/2111463.png',
//   },

// ];

const initialFormData:IMultipleForms  = {
    firstName: '',
    lastName: '',
    businessName: '',
    businessCity: '',
    businessWebsite: '',
    businessEmail: '',
    incomePerMonth: 0,
    taxPercentage: 0,
    agreeToTerms: false,
};
export {initialFormData, Banner, HomeProductsLists, ProductsHomePagesItems, HomePageNike, HomePageAdidas, HomeAnimationimages, images, navigation, CartImageHolder, VendorDescHolder, VendorsBanner, VenorsTags, Reviews, VendorOnSalesDescHolder, SingleVendorBanner, social };