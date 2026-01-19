import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AnnouncementContext = createContext();

export const useAnnouncement = () => {
    const context = useContext(AnnouncementContext);
    if (!context) {
        throw new Error('useAnnouncement must be used within an AnnouncementProvider');
    }
    return context;
};

export const AnnouncementProvider = ({ children }) => {
    const [announcementSettings, setAnnouncementSettings] = useState({
        isVisible: false,
        backgroundColor: '#E21339',
        backgroundImage: '',
        width: '100%',
        height: 'auto',
        customWidth: '',
        customHeight: '',
        content: {
            text: 'Be among the first 100 and receive',
            highlight: '$100,000',
            additionalText: 'in bonus credits.',
            linkText: 'Join Now',
            linkUrl: '#'
        }
    });
    const [showAnnouncement, setShowAnnouncement] = useState(false); // Start hidden until loaded
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnnouncementSettings();

        // Listen for real-time updates
        const subscription = supabase
            .channel('announcement_settings')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'announcement_settings' },
                (payload) => {
                    if (payload.new) {
                        let bgColor = payload.new.background_color;
                        if (bgColor?.startsWith('bg-')) {
                            const colorMap = {
                                'bg-red-600': '#E21339',
                                'bg-blue-600': '#2563eb',
                                'bg-green-600': '#16a34a',
                                'bg-purple-600': '#9333ea',
                                'bg-orange-600': '#ea580c',
                                'bg-gray-800': '#1f2937'
                            };
                            bgColor = colorMap[bgColor] || '#E21339';
                        }

                        const settings = {
                            isVisible: payload.new.is_visible,
                            backgroundColor: bgColor,
                            backgroundImage: payload.new.background_image || '',
                            width: payload.new.width || '100%',
                            height: payload.new.height || 'auto',
                            customWidth: payload.new.custom_width || '',
                            customHeight: payload.new.custom_height || '',
                            content: payload.new.content
                        };
                        setAnnouncementSettings(settings);
                        setShowAnnouncement(payload.new.is_visible);
                    }
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const fetchAnnouncementSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('announcement_settings')
                .select('*')
                .limit(1)
                .single();

            if (error && error.code !== 'PGRST116') {
                throw error;
            }

            if (data) {

                let bgColor = data.background_color;
                if (bgColor?.startsWith('bg-')) {
                    const colorMap = {
                        'bg-red-600': '#E21339',
                        'bg-blue-600': '#2563eb',
                        'bg-green-600': '#16a34a',
                        'bg-purple-600': '#9333ea',
                        'bg-orange-600': '#ea580c',
                        'bg-gray-800': '#1f2937'
                    };
                    bgColor = colorMap[bgColor] || '#dc2626';
                }

                const settings = {
                    isVisible: data.is_visible,
                    backgroundColor: bgColor,
                    backgroundImage: data.background_image || '',
                    width: data.width || '100%',
                    height: data.height || 'auto',
                    customWidth: data.custom_width || '',
                    customHeight: data.custom_height || '',
                    content: data.content
                };
                setAnnouncementSettings(settings);
                setShowAnnouncement(data.is_visible);
            } else {
                setShowAnnouncement(false);
            }
        } catch (error) {
            setShowAnnouncement(false);
        } finally {
            setLoading(false);
        }
    };

    const closeAnnouncement = () => {
        setShowAnnouncement(false);
    };

    const value = {
        announcementSettings,
        showAnnouncement,
        closeAnnouncement,
        loading,
        refreshSettings: fetchAnnouncementSettings
    };

    return (
        <AnnouncementContext.Provider value={value}>
            {children}
        </AnnouncementContext.Provider>
    );
};

export default AnnouncementContext;