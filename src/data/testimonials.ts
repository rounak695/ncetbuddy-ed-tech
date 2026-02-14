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
        name: "Devil sher",
        role: "Student",
        review: "These mock tests are amazing! The questions are very relevant and tough, which really helps in preparing for the actual exam. The quality is top-notch."
    },
    {
        name: "K Govind",
        role: "Student",
        review: "I couldn't believe the free mock tests were this good. Most platforms charge heavily but NCET Buddy provides high quality material for free. Really appreciate it!"
    },
    {
        name: "Shreenath",
        role: "Student",
        review: "Practicing PYQs as timed mock tests is a game changer. It simulates the real exam environment perfectly. Highly recommend this feature."
    },
    {
        name: "Rocky",
        role: "Student",
        review: "The post-test analysis is incredible. It breaks down my performance question by question and shows exactly where I need to improve. Best analysis tool I've seen."
    },
    {
        name: "Brad Simpson",
        role: "Student",
        review: "The website interface is very good. I have seen some pages, websites and apps for NCET exam preparation, but this one felt very nice - similar to renowned teachers like Eduniti and Vora Classes. The interface is so good and eye-catching. I appreciate your efforts and thanks for helping us crack NCET 2026!"
    }
];
