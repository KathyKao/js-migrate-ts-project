const loadingRef = document.querySelector('.loading') as HTMLHeadingElement;
const contentRef = document.querySelector('.content') as HTMLElement;

const loading: { show: () => void; hidden: () => void } = {
  show: () => {
    contentRef.innerHTML = '';
    loadingRef.classList.remove('hidden');
  },
  hidden: () => {
    loadingRef.classList.add('hidden');
  },
};

export default loading;
