import Swal from 'sweetalert2';

export const showSuccess = (title: string, text?: string) => {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    background: '#262626',
    color: '#ffffff',
    confirmButtonColor: '#C47A3A'
  });
};

export const showError = (title: string, text?: string) => {
  return Swal.fire({
    icon: 'error',
    title,
    text,
    background: '#262626',
    color: '#ffffff',
    confirmButtonColor: '#C47A3A'
  });
};

export const showConfirm = (title: string, text?: string) => {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    background: '#262626',
    color: '#ffffff',
    confirmButtonColor: '#C47A3A',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes',
    cancelButtonText: 'Cancel'
  });
};