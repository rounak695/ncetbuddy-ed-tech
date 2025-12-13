import { Card } from "@/components/ui/Card";
import styles from "./Features.module.css";

export const Features = () => {
    const features = [
        {
            title: "Mock Tests",
            description: "Practice with real exam-like questions and get instant analysis.",
            icon: "📝"
        },
        {
            title: "Study Material",
            description: "Access curated notes and books from top mentors.",
            icon: "📚"
        },
        {
            title: "Performance Tracking",
            description: "Track your progress with detailed analytics and leaderboards.",
            icon: "📊"
        },
        {
            title: "Expert Guidance",
            description: "Learn from the best mentors who have cracked the exam.",
            icon: "👨‍🏫"
        }
    ];

    return (
        <section className={styles.features}>
            <div className="container">
                <h2 className={styles.heading}>Why Choose NCET Buddy?</h2>
                <div className={styles.grid}>
                    {features.map((feature, index) => (
                        <Card key={index} className={styles.card}>
                            <div className={styles.icon}>{feature.icon}</div>
                            <h3 className={styles.title}>{feature.title}</h3>
                            <p className={styles.description}>{feature.description}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};
