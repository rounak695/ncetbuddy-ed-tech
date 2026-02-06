export interface Testimonial {
    name: string;
    role: "Teacher" | "Student";
    review: string;
}

export const testimonials: Testimonial[] = [
    {
        name: "Arjun Mehta",
        role: "Student",
        review: "The mock tests feel exactly like the real NCET exam. The interface and timer helped me manage my time better during the actual test."
    },
    {
        name: "Dr. Kavita Sharma",
        role: "Teacher",
        review: "Finally, a platform that understands educators. I can create and manage tests without any technical headaches."
    },
    {
        name: "Sneha Reddy",
        role: "Student",
        review: "The detailed analytics after each test helped me identify my weak areas. Improved my score by 40 marks in 2 months!"
    }
];
