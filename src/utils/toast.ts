// src/utils/toast.ts
import Swal from 'sweetalert2';

export const showToast = (message: string, icon: 'success' | 'error' | 'warning' | 'info') => {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon,
    title: message,
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });
};
