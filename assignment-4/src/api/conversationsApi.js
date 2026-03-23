const conversationsDb = [
  {
    id: 'conv-1',
    title: 'Image Processing',
  },
  {
    id: 'conv-2',
    title: 'Web Development Project',
  },
];

export function getConversations() {
  return Promise.resolve([...conversationsDb]);
}
