import React from 'react';
import { Container, Typography, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const faqs = [
    {
        question: "What applications are there in Kolay IK?",
        answer: "Kolay IK has many applications such as personnel management, bank integration, overtime, meal card, training and development management."
    },
    {
        question: "How can I renew my subscription?",
        answer: "If your credit card has been defined, your subscription will automatically renew and the subscription fee will be charged to your credit card. If you are paying by EFT/Bank Transfer, the system will remind you towards the end date of the package."
    },
    {
        question: "How can I cancel my subscription?",
        answer: "If you want to cancel your subscription, you can easily cancel by calling our customer service at 0212 951 06 61 or by sending an e-mail to destek@kolay.com.tr. The fee deducted from your credit card will be refunded."
    },
    {
        question: "Do you store my credit card information?",
        answer: "Your credit card information is not stored by Kolay IK at all. All payment transactions are made through a secure payment infrastructure."
    }
];

const FAQSection = () => {
    return (
        <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
            <Container maxWidth="lg">
                <Typography variant="h4" align="center" gutterBottom>
                    F.A.Q
                </Typography>
                {faqs.map((faq, index) => (
                    <Accordion key={index}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h6">{faq.question}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>{faq.answer}</Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Container>
        </Box>
    );
};

export default FAQSection;