'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for Intersection Observer
 * @param {number} threshold - Visibility threshold (0-1)
 * @returns {[Function, boolean]} - [setRef, isInView]
 */
export function useInView(threshold = 0.1) {
  const [ref, setRef] = useState(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold, rootMargin: '50px' }
    );
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return [setRef, isInView];
}

/**
 * Custom hook for scroll position tracking
 * @param {number} scrollThreshold - Threshold to trigger "scrolled" state
 * @returns {boolean} - Whether user has scrolled past threshold
 */
export function useScrolled(scrollThreshold = 50) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > scrollThreshold);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollThreshold]);

  return scrolled;
}

/**
 * Custom hook for carousel auto-rotation
 * @param {number} totalSlides - Total number of slides
 * @param {number} interval - Rotation interval in ms
 * @returns {[number, Function]} - [currentSlide, setCurrentSlide]
 */
export function useCarousel(totalSlides, interval = 5000) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, interval);
    return () => clearInterval(timer);
  }, [totalSlides, interval]);

  return [currentSlide, setCurrentSlide];
}

/**
 * Custom hook for form validation
 * @param {Object} initialData - Initial form data
 * @param {Object} validators - Validation functions for each field
 * @returns {Object} - { formData, errors, handleChange, validate, resetForm }
 */
export function useForm(initialData, validators = {}) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Real-time validation if validator exists
    if (validators[name]) {
      const error = validators[name](value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [validators]);

  const validate = useCallback(() => {
    const newErrors = {};
    Object.keys(validators).forEach(field => {
      const error = validators[field](formData[field]);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validators]);

  const resetForm = useCallback(() => {
    setFormData(initialData);
    setErrors({});
  }, [initialData]);

  return { formData, setFormData, errors, setErrors, handleChange, validate, resetForm };
}
