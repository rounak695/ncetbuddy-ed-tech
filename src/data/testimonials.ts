export interface Testimonial {
    name: string;
    role: "Teacher" | "Student";
    review: string;
}

// Testimonials are rendered only when real user feedback is available.
// Placeholder or mock data must never be shown publicly.
// To add a real testimonial, simply add an object to the array below:
// { name: "John Doe", role: "Student", review: "This platform helped me prepare effectively." }
export const testimonials: Testimonial[] = [];
