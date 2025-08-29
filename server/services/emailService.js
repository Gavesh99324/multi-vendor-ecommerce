export const sendEmail = async ({ to, subject, html }) => {
    console.log(`Email → ${to} | ${subject}`);
    return { success: true };
    };