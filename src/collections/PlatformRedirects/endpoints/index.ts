// import type { PayloadRequest } from 'payload';

// export const incrementPlatformClick = async (req: PayloadRequest, res: any): Promise<void> => {
//     const { slug } = req.query;

//     if (!slug) {
//         res.status(400).json({ error: 'Missing slug' });
//         return;
//     }

//     try {
//         const result = await req.payload.find({
//             collection: 'platform-redirects',
//             where: { slug: { equals: slug } },
//         });

//         if (!result?.docs?.length) {
//             res.status(404).json({ error: 'Redirect not found' });
//             return;
//         }

//         const doc = result.docs[0];

//         await req.payload.update({
//             collection: 'platform-redirects',
//             id: doc.id,
//             data: { clicks: (doc.clicks || 0) + 1 },
//         });

//         res.status(200).json({ message: 'Click incremented successfully' });
//     } catch (error) {
//         console.error('Click count update failed:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };
