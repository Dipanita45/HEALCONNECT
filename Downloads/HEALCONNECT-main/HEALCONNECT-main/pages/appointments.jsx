import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { appointmentSchema } from '../lib/schemas';
import styles from './Appointments.module.css';

export default function Appointments() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(appointmentSchema),
  });

  const onSubmit = (data) => {
    alert('Appointment booked!');
    console.log(data);
  };

  const watchDate = watch('date');
  const watchDoctor = watch('doctor');

  useEffect(() => {
    if (watchDate && watchDoctor) {
      console.log('Date and doctor selected');
    }
  }, [watchDate, watchDoctor]);


  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Book Appointment</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className="flex flex-col mb-4">
          <label className={styles.formLabel}>Patient Name:</label>
          <input
            type="text"
            {...register('name')}
            className={styles.input}
          />
          {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
        </div>

        <div className="flex flex-col mb-4">
          <label className={styles.formLabel}>Date:</label>
          <input
            type="date"
            {...register('date')}
            className={styles.input}
          />
          {errors.date && <span className="text-red-500 text-sm">{errors.date.message}</span>}
        </div>

        <div className="flex flex-col mb-4">
          <label className={styles.formLabel}>Doctor's Name:</label>
          <input
            type="text"
            {...register('doctor')}
            className={styles.input}
          />
          {errors.doctor && <span className="text-red-500 text-sm">{errors.doctor.message}</span>}
        </div>

        <button type="submit" className={styles.button}>Book</button>
      </form>
    </div>
  );
}
