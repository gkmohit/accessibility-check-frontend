import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  Card, 
  Button, 
  Input, 
  Label, 
  ErrorMessage, 
  Select,
  colors,
  LoadingSpinner 
} from '../styles/components';
import { scanService } from '../services/api';

const FormWrapper = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const FormTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${colors.gray[900]};
  margin-bottom: 0.5rem;
`;

const FormDescription = styled.p`
  color: ${colors.gray[600]};
  margin-bottom: 2rem;
`;

const FormGrid = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const InputGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ThreeColumnGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: end;
  margin-top: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const schema = yup.object({
  websiteUrl: yup
    .string()
    .required('Website URL is required')
    .url('Please enter a valid URL'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .test('valid-domain', 'Please use a valid email domain (e.g., gmail.com, company.com)', function(value) {
      if (!value) return true;
      // Basic check for common invalid domains
      const invalidDomains = ['example.com', 'test.com', 'localhost'];
      const domain = value.split('@')[1];
      return !invalidDomains.includes(domain);
    }),
  scheduleType: yup
    .string()
    .required('Schedule type is required')
    .oneOf(['immediate', 'cron', 'interval', 'date']),
  timezone: yup.string().when('scheduleType', {
    is: (val: string) => val !== 'immediate',
    then: (schema) => schema.required('Timezone is required'),
    otherwise: (schema) => schema.optional(),
  }),
  // Cron fields
  minute: yup.string().when('scheduleType', {
    is: 'cron',
    then: (schema) => schema.required('Minute is required'),
    otherwise: (schema) => schema.optional(),
  }),
  hour: yup.string().when('scheduleType', {
    is: 'cron',
    then: (schema) => schema.required('Hour is required'),
    otherwise: (schema) => schema.optional(),
  }),
  dayOfWeek: yup.string().when('scheduleType', {
    is: 'cron',
    then: (schema) => schema.required('Day of week is required'),
    otherwise: (schema) => schema.optional(),
  }),
  // Interval fields
  intervalValue: yup.number().when('scheduleType', {
    is: 'interval',
    then: (schema) => schema.required('Interval value is required').min(1, 'Must be at least 1'),
    otherwise: (schema) => schema.optional(),
  }),
  intervalUnit: yup.string().when('scheduleType', {
    is: 'interval',
    then: (schema) => schema.required('Interval unit is required'),
    otherwise: (schema) => schema.optional(),
  }),
  // Date field
  scheduledDateTime: yup.string().when('scheduleType', {
    is: 'date',
    then: (schema) => schema.required('Scheduled time is required')
      .test('future-date', 'Scheduled time must be in the future', function(value) {
        if (!value) return true;
        const selectedDate = new Date(value);
        const now = new Date();
        return selectedDate > now;
      }),
    otherwise: (schema) => schema.optional(),
  }),
});

type FormData = {
  websiteUrl: string;
  email: string;
  scheduleType: 'immediate' | 'cron' | 'interval' | 'date';
  timezone?: string;
  // Cron fields
  minute?: string;
  hour?: string;
  dayOfWeek?: string;
  // Interval fields
  intervalValue?: number;
  intervalUnit?: 'minutes' | 'hours' | 'days';
  // Date field
  scheduledDateTime?: string;
};

const NewScanForm: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      scheduleType: 'immediate',
      timezone: 'UTC',
      minute: '0',
      hour: '9',
      dayOfWeek: 'mon-fri',
      intervalValue: 1,
      intervalUnit: 'hours',
    },
  });

  const scheduleType = watch('scheduleType');

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      if (data.scheduleType === 'immediate') {
        // Run immediate scan
        const response = await scanService.runImmediateScan(data.email, data.websiteUrl);
        toast.success(`Scan queued successfully! Job ID: ${response.job_id}`);
      } else {
        // Schedule scan
        const schedule: any = {
          type: data.scheduleType,
          timezone: data.timezone || 'UTC',
        };

        if (data.scheduleType === 'cron') {
          schedule.cron = {
            minute: data.minute,
            hour: data.hour,
            day_of_week: data.dayOfWeek,
          };
        } else if (data.scheduleType === 'interval') {
          schedule.interval = {
            [data.intervalUnit!]: data.intervalValue,
          };
        } else if (data.scheduleType === 'date') {
          schedule.run_at = data.scheduledDateTime;
        }

        const response = await scanService.scheduleScan({
          email: data.email,
          url: data.websiteUrl,
          schedule,
        });
        
        toast.success(`Scan scheduled successfully! Job ID: ${response.job_id}`);
      }
      
      reset();
      navigate('/scans');
    } catch (error: any) {
      console.error('Error creating scan:', error);
      toast.error(error.message || 'An error occurred while creating the scan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormWrapper>
      <FormTitle>Schedule Website Accessibility Scan</FormTitle>
      <FormDescription>
        Schedule an automated accessibility and performance scan for your website. 
        We'll analyze your site using Google Lighthouse and advanced DOM inspection tools, 
        then email you a comprehensive report.
      </FormDescription>

      <Card>
        <form onSubmit={handleSubmit(onSubmit as any)}>
          <FormGrid>
            <FormGroup>
              <Label htmlFor="websiteUrl">Website URL *</Label>
              <Input
                id="websiteUrl"
                type="url"
                placeholder="https://example.com"
                error={!!errors.websiteUrl}
                {...register('websiteUrl')}
              />
              {errors.websiteUrl && (
                <ErrorMessage>{errors.websiteUrl.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@gmail.com"
                error={!!errors.email}
                {...register('email')}
              />
              {errors.email && (
                <ErrorMessage>{errors.email.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="scheduleType">Schedule Type *</Label>
              <Select
                id="scheduleType"
                error={!!errors.scheduleType}
                {...register('scheduleType')}
              >
                <option value="immediate">Run Immediately</option>
                <option value="cron">Recurring (Cron)</option>
                <option value="interval">Interval</option>
                <option value="date">One-time at Specific Date</option>
              </Select>
              {errors.scheduleType && (
                <ErrorMessage>{errors.scheduleType.message}</ErrorMessage>
              )}
            </FormGroup>

            {scheduleType !== 'immediate' && (
              <FormGroup>
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  id="timezone"
                  error={!!errors.timezone}
                  {...register('timezone')}
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                </Select>
                {errors.timezone && (
                  <ErrorMessage>{errors.timezone.message}</ErrorMessage>
                )}
              </FormGroup>
            )}

            {scheduleType === 'cron' && (
              <ThreeColumnGroup>
                <FormGroup>
                  <Label htmlFor="minute">Minute</Label>
                  <Input
                    id="minute"
                    type="text"
                    placeholder="0"
                    error={!!errors.minute}
                    {...register('minute')}
                  />
                  {errors.minute && (
                    <ErrorMessage>{errors.minute.message}</ErrorMessage>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="hour">Hour</Label>
                  <Input
                    id="hour"
                    type="text"
                    placeholder="9"
                    error={!!errors.hour}
                    {...register('hour')}
                  />
                  {errors.hour && (
                    <ErrorMessage>{errors.hour.message}</ErrorMessage>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="dayOfWeek">Day of Week</Label>
                  <Input
                    id="dayOfWeek"
                    type="text"
                    placeholder="mon-fri"
                    error={!!errors.dayOfWeek}
                    {...register('dayOfWeek')}
                  />
                  {errors.dayOfWeek && (
                    <ErrorMessage>{errors.dayOfWeek.message}</ErrorMessage>
                  )}
                </FormGroup>
              </ThreeColumnGroup>
            )}

            {scheduleType === 'interval' && (
              <InputGroup>
                <FormGroup>
                  <Label htmlFor="intervalValue">Every</Label>
                  <Input
                    id="intervalValue"
                    type="number"
                    min="1"
                    error={!!errors.intervalValue}
                    {...register('intervalValue', { valueAsNumber: true })}
                  />
                  {errors.intervalValue && (
                    <ErrorMessage>{errors.intervalValue.message}</ErrorMessage>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="intervalUnit">Unit</Label>
                  <Select
                    id="intervalUnit"
                    error={!!errors.intervalUnit}
                    {...register('intervalUnit')}
                  >
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                  </Select>
                  {errors.intervalUnit && (
                    <ErrorMessage>{errors.intervalUnit.message}</ErrorMessage>
                  )}
                </FormGroup>
              </InputGroup>
            )}

            {scheduleType === 'date' && (
              <FormGroup>
                <Label htmlFor="scheduledDateTime">Scheduled Time</Label>
                <Input
                  id="scheduledDateTime"
                  type="datetime-local"
                  min={new Date(Date.now() + 5 * 60000).toISOString().slice(0, 16)}
                  error={!!errors.scheduledDateTime}
                  {...register('scheduledDateTime')}
                />
                {errors.scheduledDateTime && (
                  <ErrorMessage>{errors.scheduledDateTime.message}</ErrorMessage>
                )}
              </FormGroup>
            )}
          </FormGrid>

          <FormActions>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/scans')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoadingSpinner />
                  {scheduleType === 'immediate' ? 'Running Scan...' : 'Scheduling Scan...'}
                </>
              ) : (
                scheduleType === 'immediate' ? 'Run Scan Now' : 'Schedule Scan'
              )}
            </Button>
          </FormActions>
        </form>
      </Card>
    </FormWrapper>
  );
};

export default NewScanForm;
