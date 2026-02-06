export interface Testimonial {
    name: string;
    role: "Teacher" | "Student";
    review: string;
}

// Testimonials are rendered only when real user feedback is available.
// Placeholder or mock data must never be shown publicly.
// To add a real testimonial, simply add an object to the array below:
// { name: "John Doe", role: "Student", review: "This platform helped me prepare effectively." }
export const testimonials: Testimonial[] = [
    {
        name: "Brad Simpson",
        role: "Student",
        review: "The website interface is very good. I have seen some pages, websites and apps for NCET exam preparation, but this one felt very nice - similar to renowned teachers like Eduniti and Vora Classes. The interface is so good and eye-catching. I appreciate your efforts and thanks for helping us crack NCET 2026!"
    }
];
