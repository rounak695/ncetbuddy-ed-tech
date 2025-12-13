import { Card } from "@/components/ui/Card";
import styles from "./Mentors.module.css";

export const Mentors = () => {
    // Placeholder data - eventually fetched from Firestore
    const mentors = [
        {
            name: "Rounak Paul",
            role: "Lead Mentor",
            image: "https://via.placeholder.com/150" // Replace with real image later
        },
        {
            name: "Jane Doe",
            role: "Mathematics Expert",
            image: "https://via.placeholder.com/150"
        }
    ];

    return (
        <section className={styles.mentors}>
            <div className="container">
                <h2 className={styles.heading}>Meet Your Mentors</h2>
                <div className={styles.grid}>
                    {mentors.map((mentor, index) => (
                        <div key={index} className={styles.mentorCard}>
                            <div className={styles.imageContainer}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={mentor.image} alt={mentor.name} className={styles.image} />
                            </div>
                            <h3 className={styles.name}>{mentor.name}</h3>
                            <p className={styles.role}>{mentor.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
