import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { 
    Save, Palette, X, ChevronDown, ArrowLeft, Plus, Trash2, 
    Type, Image, Link, AlertCircle, Megaphone, Gift, 
    Eye, EyeOff, Move, Edit3, Sparkles, LayoutTemplate,
    ChevronUp
} from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import Seo from '../components/SEO';

const AnnouncementAdmin = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [settings, setSettings] = useState({
        isVisible: true,
        template: 'simple', // Template type
        backgroundColor: '#dc2626',
        backgroundImage: '',
        width: '100%',
        height: 'auto',
        content: {
            blocks: [
                {
                    id: '1',
                    type: 'text',
                    content: 'Be among the first 100 and receive',
                    styles: { fontSize: 'text-sm', fontWeight: 'font-medium', color: '#ffffff' }
                },
                {
                    id: '2', 
                    type: 'highlight',
                    content: '$100,000',
                    styles: { fontSize: 'text-sm', fontWeight: 'font-bold', color: '#ffffff' }
                },
                {
                    id: '3',
                    type: 'text', 
                    content: 'in bonus credits.',
                    styles: { fontSize: 'text-sm', fontWeight: 'font-medium', color: '#ffffff' }
                },
                {
                    id: '4',
                    type: 'link',
                    content: 'Join Now',
                    url: '#',
                    styles: { fontSize: 'text-sm', fontWeight: 'font-bold', color: '#ffffff', textDecoration: 'underline' }
                }
            ]
        }
    });
    const [currentId, setCurrentId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [selectedBlock, setSelectedBlock] = useState(null);
    const [showTemplateSelector, setShowTemplateSelector] = useState(false);
    const [showNavbar, setShowNavbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Announcement Templates
    const templates = [
        {
            id: 'simple',
            name: 'Simple Text',
            icon: Type,
            description: 'Basic text with optional highlights',
            preview: 'Simple announcement text with highlights',
            defaultBlocks: [
                { id: '1', type: 'text', content: 'Your announcement text here', styles: { fontSize: 'text-sm', fontWeight: 'font-medium', color: '#ffffff' } }
            ]
        },
        {
            id: 'cta',
            name: 'Call to Action',
            icon: Megaphone,
            description: 'Compelling message with prominent button',
            preview: 'Special Offer - 50% OFF • Limited Time Only!',
            defaultBlocks: [
                { id: '1', type: 'text', content: 'Special Offer - 50% OFF', styles: { fontSize: 'text-lg', fontWeight: 'font-bold', color: '#ffffff' } },
                { 
                    id: '2', 
                    type: 'button', 
                    content: 'Claim Now', 
                    url: '#', 
                    styles: { 
                        backgroundColor: '#ffffff', 
                        color: '#dc2626', 
                        padding: 'px-6 py-3', 
                        borderRadius: 'rounded-full',
                        fontSize: 'text-sm',
                        fontWeight: 'font-bold'
                    } 
                }
            ]
        },
        {
            id: 'emergency',
            name: 'Emergency Alert', 
            icon: AlertCircle,
            description: 'High-priority urgent messaging',
            preview: '🚨 URGENT: System maintenance in 30 minutes',
            defaultBlocks: [
                { id: '1', type: 'icon', content: '🚨', styles: { fontSize: 'text-lg' } },
                { id: '2', type: 'text', content: 'URGENT:', styles: { fontSize: 'text-sm', fontWeight: 'font-bold', color: '#ffffff' } },
                { id: '3', type: 'text', content: 'Important announcement here', styles: { fontSize: 'text-sm', fontWeight: 'font-medium', color: '#ffffff' } }
            ]
        },
        {
            id: 'promotion',
            name: 'Promotion Banner',
            icon: Gift,
            description: 'Eye-catching sales and offers',
            preview: '🎉 BLACK FRIDAY: Up to 70% OFF Everything!',
            defaultBlocks: [
                { id: '1', type: 'icon', content: '🎉', styles: { fontSize: 'text-lg' } },
                { id: '2', type: 'text', content: 'BLACK FRIDAY:', styles: { fontSize: 'text-sm', fontWeight: 'font-bold', color: '#ffffff' } },
                { id: '3', type: 'highlight', content: 'Up to 70% OFF', styles: { fontSize: 'text-lg', fontWeight: 'font-black', color: '#ffff00' } },
                { id: '4', type: 'link', content: 'Shop Now', url: '#', styles: { fontSize: 'text-sm', fontWeight: 'font-bold', color: '#ffffff', textDecoration: 'underline' } }
            ]
        },
        {
            id: 'image',
            name: 'Image Banner',
            icon: Image,
            description: 'Background image with text overlay',
            preview: 'Rich banner with background image',
            defaultBlocks: [
                { id: '1', type: 'background', content: '', url: 'https://via.placeholder.com/1200x60/4f46e5/ffffff?text=Background+Image' },
                { id: '2', type: 'image', content: 'Logo', url: 'https://via.placeholder.com/32x32', width: '32px', height: '32px' },
                { id: '3', type: 'text', content: 'Stunning announcement with image background', styles: { fontSize: 'text-lg', fontWeight: 'font-bold', color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' } }
            ]
        },
        {
            id: 'custom',
            name: 'Custom HTML',
            icon: Edit3,
            description: 'Full HTML/CSS freedom',
            preview: 'Complete creative control',
            defaultBlocks: [
                { id: '1', type: 'html', content: '<div class="flex items-center justify-center gap-2 text-white"><span class="animate-pulse">✨</span> Custom HTML Content <span class="animate-pulse">✨</span></div>' }
            ]
        }
    ];

    const presetColors = [
        { name: 'Red', color: '#E21339' },
        { name: 'Blue', color: '#2563eb' },
        { name: 'Green', color: '#16a34a' },
        { name: 'Purple', color: '#9333ea' },
        { name: 'Orange', color: '#ea580c' },
        { name: 'Dark Gray', color: '#1f2937' },
        { name: 'Pink', color: '#db2777' },
        { name: 'Indigo', color: '#4f46e5' },
        { name: 'Yellow', color: '#ca8a04' },
        { name: 'Emerald', color: '#059669' },
        { name: 'Cyan', color: '#0891b2' },
        { name: 'Black', color: '#000000' },
    ];

    useEffect(() => {
        fetchSettings();
    }, []);

    // Navbar hide/show on scroll
    useEffect(() => {
        const controlNavbar = () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY < 10) {
                // Always show navbar at the top
                setShowNavbar(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down & past threshold - hide navbar
                setShowNavbar(false);
            } else if (currentScrollY < lastScrollY) {
                // Scrolling up - show navbar
                setShowNavbar(true);
            }
            
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', controlNavbar);
        return () => window.removeEventListener('scroll', controlNavbar);
    }, [lastScrollY]);

    const fetchSettings = async () => {
        try {
            console.log('Admin fetching settings...');
            const { data, error } = await supabase
                .from('announcement_settings')
                .select('*')
                .limit(1)
                .single();

            console.log('Admin fetch result:', { data, error });

            if (error && error.code !== 'PGRST116') {
                throw error;
            }

            if (data) {
                console.log('Admin found settings:', data);
                setCurrentId(data.id);

                // Convert Tailwind class to hex color if needed
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
                    bgColor = colorMap[bgColor] || '#E21339';
                }

                // Handle legacy and new format
                if (data.content?.blocks) {
                    // New template-based format
                    setSettings({
                        isVisible: data.is_visible,
                        backgroundColor: bgColor,
                        backgroundImage: data.background_image || '',
                        width: data.width || '100%',
                        height: data.height || 'auto',
                        customWidth: data.custom_width || '',
                        customHeight: data.custom_height || '',
                        template: data.content.template || 'simple',
                        content: data.content
                    });
                } else {
                    // Legacy format - convert to new format
                    const legacyToBlocks = (content) => [
                        { id: '1', type: 'text', content: content?.text || '', styles: { fontSize: 'text-sm', fontWeight: 'font-medium', color: '#ffffff' } },
                        { id: '2', type: 'highlight', content: content?.highlight || '', styles: { fontSize: 'text-sm', fontWeight: 'font-bold', color: '#ffffff' } },
                        { id: '3', type: 'text', content: content?.additionalText || '', styles: { fontSize: 'text-sm', fontWeight: 'font-medium', color: '#ffffff' } },
                        { id: '4', type: 'link', content: content?.linkText || '', url: content?.linkUrl || '#', styles: { fontSize: 'text-sm', fontWeight: 'font-bold', color: '#ffffff', textDecoration: 'underline' } }
                    ];

                    setSettings({
                        isVisible: data.is_visible,
                        backgroundColor: bgColor,
                        backgroundImage: data.background_image || '',
                        width: data.width || '100%',
                        height: data.height || 'auto',
                        template: 'simple',
                        content: {
                            template: 'simple',
                            blocks: legacyToBlocks(data.content || {})
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
            setMessage('Failed to load settings: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            console.log('Saving announcement settings:', settings);
            const { error } = await supabase
                .from('announcement_settings')
                .upsert({
                    id: currentId || 1,
                    is_visible: settings.isVisible,
                    background_color: settings.backgroundColor,
                    background_image: settings.backgroundImage || null,
                    width: settings.width || '100%',
                    height: settings.height || 'auto',
                    custom_width: settings.customWidth || null,
                    custom_height: settings.customHeight || null,
                    content: {
                        ...settings.content,
                        template: settings.template
                    },
                    updated_at: new Date().toISOString()
                });

            console.log('Save result:', { error });

            if (error) {
                console.error('Save error:', error);
                throw error;
            }

            setMessage('Settings saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error saving settings:', error);
            setMessage('Failed to save settings: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    // Template and Block Management Functions
    const selectTemplate = (templateId) => {
        const template = templates.find(t => t.id === templateId);
        if (template) {
            setSettings(prev => ({
                ...prev,
                template: templateId,
                content: {
                    template: templateId,
                    blocks: template.defaultBlocks
                }
            }));
        }
        setShowTemplateSelector(false);
    };

    const updateBlock = (blockId, field, value) => {
        setSettings(prev => ({
            ...prev,
            content: {
                ...prev.content,
                blocks: prev.content.blocks.map(block =>
                    block.id === blockId
                        ? { ...block, [field]: value }
                        : block
                )
            }
        }));
    };

    const updateBlockStyle = (blockId, styleField, styleValue) => {
        setSettings(prev => ({
            ...prev,
            content: {
                ...prev.content,
                blocks: prev.content.blocks.map(block =>
                    block.id === blockId
                        ? { ...block, styles: { ...block.styles, [styleField]: styleValue } }
                        : block
                )
            }
        }));
    };

    const addBlock = (type) => {
        const getDefaultStyles = (blockType) => {
            if (blockType === 'button') {
                return {
                    fontSize: 'text-sm',
                    fontWeight: 'font-bold',
                    color: '#ffffff',
                    backgroundColor: '#3b82f6',
                    padding: 'px-4 py-2',
                    borderRadius: 'rounded-lg'
                };
            }
            return {
                fontSize: 'text-sm',
                fontWeight: 'font-medium',
                color: '#ffffff'
            };
        };

        const newBlock = {
            id: Date.now().toString(),
            type,
            content: type === 'text' ? 'New text' : type === 'icon' ? '✨' : type === 'link' ? 'New link' : type === 'button' ? 'New button' : type === 'image' ? 'Image Alt Text' : 'New content',
            url: (type === 'link' || type === 'button' || type === 'image') ? (type === 'image' ? 'https://picsum.photos/32/32?random=' + Date.now() : '#') : undefined,
            width: type === 'image' ? '32px' : undefined,
            height: type === 'image' ? '32px' : undefined,
            styles: getDefaultStyles(type)
        };

        setSettings(prev => ({
            ...prev,
            content: {
                ...prev.content,
                blocks: [...prev.content.blocks, newBlock]
            }
        }));
    };

    const removeBlock = (blockId) => {
        setSettings(prev => ({
            ...prev,
            content: {
                ...prev.content,
                blocks: prev.content.blocks.filter(block => block.id !== blockId)
            }
        }));
    };

    const moveBlock = (blockId, direction) => {
        setSettings(prev => {
            const blocks = [...prev.content.blocks];
            const index = blocks.findIndex(block => block.id === blockId);
            
            if (direction === 'up' && index > 0) {
                [blocks[index], blocks[index - 1]] = [blocks[index - 1], blocks[index]];
            } else if (direction === 'down' && index < blocks.length - 1) {
                [blocks[index], blocks[index + 1]] = [blocks[index + 1], blocks[index]];
            }

            return {
                ...prev,
                content: {
                    ...prev.content,
                    blocks
                }
            };
        });
    };

    const updateContent = (field, value) => {
        setSettings(prev => ({
            ...prev,
            content: {
                ...prev.content,
                [field]: value
            }
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <>
        <Seo
          title="Announcement admin"
          description="Manage PilotUP announcement bar. Edit content and visibility."
          canonical="/admin/announcement"
          type="website"
        />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-6 py-8">
            {/* Custom styles */}
            <style>{`
                * {
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }
                
                .react-colorful {
                    width: 100% !important;
                    height: 200px !important;
                    border-radius: 16px !important;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12) !important;
                }
                .react-colorful__saturation {
                    border-radius: 16px 16px 0 0 !important;
                }
                .react-colorful__hue {
                    border-radius: 0 0 16px 16px !important;
                    height: 28px !important;
                }
                .react-colorful__saturation-pointer, .react-colorful__hue-pointer {
                    width: 24px !important;
                    height: 24px !important;
                    border-width: 3px !important;
                    border-color: #ffffff !important;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25) !important;
                }
            `}</style>

            <div className="max-w-7xl mx-auto">
                {/* Header - Fixed with Animation */}
                <div className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-in-out transform ${
                    showNavbar ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
                }`}>
                    <div className="backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-xl shadow-black/5">
                        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
                                <div className="flex items-center gap-2 md:gap-6 w-full md:w-auto">
                                    <button
                                        onClick={() => navigate('/blog/admin')}
                                        className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-lg transition-all duration-200 flex-shrink-0"
                                    >
                                        <ArrowLeft className="h-4 md:h-5 w-4 md:w-5" />
                                        <span className="text-xs md:text-sm font-medium hidden sm:inline">Back</span>
                                    </button>
                                    <div className="hidden sm:block h-6 md:h-8 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
                                    <div className="flex-1 md:flex-none">
                                        <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent line-clamp-1">
                                            Announcement Builder
                                        </h1>
                                        <p className="text-xs text-gray-500 mt-0.5 hidden md:block">Craft engaging announcements</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
                                    <button
                                        onClick={() => setShowTemplateSelector(true)}
                                        className="flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2 px-2 md:px-4 py-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white font-medium text-xs md:text-sm hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105 transition-all duration-200"
                                    >
                                        <LayoutTemplate className="h-3 md:h-4 w-3 md:w-4" />
                                        <span>Templates</span>
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2 px-2 md:px-5 py-2 rounded-xl bg-gradient-to-br from-[#E21339] to-[#B00D2F] text-white font-medium text-xs md:text-sm hover:shadow-lg hover:shadow-red-500/20 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                    >
                                        <Save className="h-3 md:h-4 w-3 md:w-4" />
                                        {saving ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </div>

                            {message && (
                                <div className="mt-3 md:mt-4 p-2 md:p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/50 text-emerald-700 rounded-xl text-xs md:text-sm font-medium backdrop-blur-sm">
                                    ✓ {message}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Spacer for fixed header */}
                <div className="h-24 md:h-28"></div>

                {/* Live Preview - Full Width */}
                <div className="bg-white rounded-xl md:rounded-2xl shadow-lg shadow-black/5 border border-white/50 overflow-hidden backdrop-blur-xl mb-8 md:mb-12">
                    <div className="p-4 md:p-8 border-b border-gray-100/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg md:text-xl font-bold text-gray-900">Live Preview</h2>
                            <p className="text-xs md:text-sm text-gray-500 mt-1 hidden md:block">See how your announcement appears to users</p>
                        </div>
                        <button
                            onClick={() => setSettings(prev => ({ ...prev, isVisible: !prev.isVisible }))}
                            className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg md:rounded-xl font-medium text-xs md:text-sm transition-all duration-200 flex-shrink-0 ${
                                settings.isVisible
                                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 hover:shadow-lg hover:shadow-emerald-500/10'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-lg hover:shadow-gray-500/10'
                            }`}
                        >
                            {settings.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            {settings.isVisible ? 'Visible' : 'Hidden'}
                        </button>
                    </div>
                    <div className="p-4 md:p-8">
                        {settings.isVisible && (
                            <div className="border border-gray-200/50 rounded-xl md:rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                                <AnnouncementBarPreview settings={settings} />
                            </div>
                        )}
                        {!settings.isVisible && (
                            <div className="text-center py-8 md:py-12">
                                <div className="inline-flex items-center justify-center w-12 md:w-16 h-12 md:h-16 rounded-full bg-gray-100/50 mb-3 md:mb-4">
                                    <EyeOff className="h-6 md:h-8 w-6 md:w-8 text-gray-400" />
                                </div>
                                <p className="text-sm md:text-base text-gray-500 font-medium">Announcement is currently hidden</p>
                                <p className="text-xs md:text-sm text-gray-400 mt-1">Enable it to preview</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Builder - Full Width */}
                <div className="bg-white rounded-xl md:rounded-2xl shadow-lg shadow-black/5 border border-white/50 overflow-hidden backdrop-blur-xl mb-8 md:mb-12">
                    <div className="p-4 md:p-8 border-b border-gray-100/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg md:text-xl font-bold text-gray-900">Content Builder</h2>
                            <p className="text-xs md:text-sm text-gray-500 mt-1 hidden md:block">Compose your announcement blocks</p>
                        </div>
                        <div className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg md:rounded-xl border border-blue-100/50 text-xs md:text-sm flex-shrink-0">
                            <span className="font-medium text-gray-600 uppercase tracking-wider hidden sm:inline">Template:</span>
                            <div className="hidden sm:block h-5 w-px bg-gradient-to-b from-blue-200 to-indigo-200"></div>
                            <span className="px-2 md:px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg text-xs font-bold line-clamp-1">
                                {templates.find(t => t.id === settings.template)?.name || 'Simple'}
                            </span>
                        </div>
                    </div>
                    <div className="p-4 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                            {settings.content?.blocks?.map((block, index) => (
                                <ContentBlock
                                    key={block.id}
                                    block={block}
                                    index={index}
                                    totalBlocks={settings.content.blocks.length}
                                    onUpdate={(field, value) => updateBlock(block.id, field, value)}
                                    onUpdateStyle={(field, value) => updateBlockStyle(block.id, field, value)}
                                    onRemove={() => removeBlock(block.id)}
                                    onMove={(direction) => moveBlock(block.id, direction)}
                                    isSelected={selectedBlock === block.id}
                                    onSelect={() => setSelectedBlock(block.id === selectedBlock ? null : block.id)}
                                />
                            ))}
                        </div>

                        {/* Add Block Buttons */}
                        <div className="pt-6 md:pt-8 border-t border-gray-100/50">
                            <p className="text-xs md:text-sm font-bold text-gray-900 mb-3 md:mb-4 uppercase tracking-wide">Add Content Block</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
                                <button
                                    onClick={() => addBlock('text')}
                                    className="flex flex-col items-center gap-2 px-4 py-3 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 rounded-xl border border-gray-200/50 hover:border-blue-200 transition-all duration-200 group"
                                >
                                    <div className="p-2 bg-white rounded-lg group-hover:bg-blue-500 group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-all duration-200">
                                        <Type className="h-4 w-4 text-gray-600 group-hover:text-white" />
                                    </div>
                                    <span className="text-xs font-semibold text-gray-700">Text</span>
                                </button>
                                <button
                                    onClick={() => addBlock('highlight')}
                                    className="flex flex-col items-center gap-2 px-4 py-3 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-yellow-50 hover:to-yellow-100 rounded-xl border border-gray-200/50 hover:border-yellow-200 transition-all duration-200 group"
                                >
                                    <div className="p-2 bg-white rounded-lg group-hover:bg-yellow-500 group-hover:shadow-lg group-hover:shadow-yellow-500/20 transition-all duration-200">
                                        <Sparkles className="h-4 w-4 text-gray-600 group-hover:text-white" />
                                    </div>
                                    <span className="text-xs font-semibold text-gray-700">Highlight</span>
                                </button>
                                <button
                                    onClick={() => addBlock('link')}
                                    className="flex flex-col items-center gap-2 px-4 py-3 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-purple-50 hover:to-purple-100 rounded-xl border border-gray-200/50 hover:border-purple-200 transition-all duration-200 group"
                                >
                                    <div className="p-2 bg-white rounded-lg group-hover:bg-purple-500 group-hover:shadow-lg group-hover:shadow-purple-500/20 transition-all duration-200">
                                        <Link className="h-4 w-4 text-gray-600 group-hover:text-white" />
                                    </div>
                                    <span className="text-xs font-semibold text-gray-700">Link</span>
                                </button>
                                <button
                                    onClick={() => addBlock('button')}
                                    className="flex flex-col items-center gap-2 px-4 py-3 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-red-50 hover:to-red-100 rounded-xl border border-gray-200/50 hover:border-red-200 transition-all duration-200 group"
                                >
                                    <div className="p-2 bg-white rounded-lg group-hover:bg-[#E21339] group-hover:shadow-lg group-hover:shadow-red-500/20 transition-all duration-200">
                                        <Gift className="h-4 w-4 text-gray-600 group-hover:text-white" />
                                    </div>
                                    <span className="text-xs font-semibold text-gray-700">Button</span>
                                </button>
                                <button
                                    onClick={() => addBlock('icon')}
                                    className="flex flex-col items-center gap-2 px-4 py-3 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-pink-50 hover:to-pink-100 rounded-xl border border-gray-200/50 hover:border-pink-200 transition-all duration-200 group"
                                >
                                    <div className="p-2 bg-white rounded-lg group-hover:bg-pink-500 group-hover:shadow-lg group-hover:shadow-pink-500/20 transition-all duration-200">
                                        <Sparkles className="h-4 w-4 text-gray-600 group-hover:text-white" />
                                    </div>
                                    <span className="text-xs font-semibold text-gray-700">Icon</span>
                                </button>
                                <button
                                    onClick={() => addBlock('image')}
                                    className="flex flex-col items-center gap-2 px-4 py-3 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-cyan-50 hover:to-cyan-100 rounded-xl border border-gray-200/50 hover:border-cyan-200 transition-all duration-200 group"
                                >
                                    <div className="p-2 bg-white rounded-lg group-hover:bg-cyan-500 group-hover:shadow-lg group-hover:shadow-cyan-500/20 transition-all duration-200">
                                        <Image className="h-4 w-4 text-gray-600 group-hover:text-white" />
                                    </div>
                                    <span className="text-xs font-semibold text-gray-700">Image</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Design Settings */}
                <div className="bg-white rounded-xl md:rounded-2xl shadow-lg shadow-black/5 border border-white/50 overflow-hidden backdrop-blur-xl p-4 md:p-8">
                    <div className="mb-6 md:mb-8">
                        <h2 className="text-lg md:text-xl font-bold text-gray-900">Design Settings</h2>
                        <p className="text-xs md:text-sm text-gray-500 mt-2 hidden md:block">Customize colors and dimensions</p>
                    </div>
                    
                    <div className="space-y-8 md:space-y-10">
                        {/* Background Color */}
                        <div className="space-y-4 md:space-y-5">
                            <div>
                                <label className="block text-xs md:text-sm font-bold text-gray-900 mb-3 md:mb-4 uppercase tracking-wider">Background Color</label>
                            </div>
                            
                            {/* Preset Colors */}
                            <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-2 md:gap-3">
                                {presetColors.map((preset) => (
                                    <button
                                        key={preset.name}
                                        onClick={() => setSettings(prev => ({ ...prev, backgroundColor: preset.color }))}
                                        className={`relative w-10 h-10 rounded-lg transition-all duration-200 group ${
                                            settings.backgroundColor === preset.color
                                                ? 'ring-2 ring-offset-2 ring-gray-900 shadow-lg scale-105'
                                                : 'hover:scale-115 hover:shadow-md'
                                        }`}
                                        style={{ backgroundColor: preset.color }}
                                        title={preset.name}
                                    >
                                        {settings.backgroundColor === preset.color && (
                                            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">✓</div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Custom Color Picker */}
                            <div className="pt-4 md:pt-6 border-t border-gray-100">
                                <button
                                    onClick={() => setShowColorPicker(!showColorPicker)}
                                    className="w-full flex items-center gap-3 md:gap-4 px-3 md:px-5 py-3 md:py-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl md:rounded-2xl hover:from-gray-100 hover:to-gray-150 transition-all duration-200 border border-gray-200/50 group"
                                >
                                    <div
                                        className="w-10 md:w-12 h-10 md:h-12 rounded-lg md:rounded-xl border-2 border-white shadow-lg group-hover:scale-110 transition-transform duration-200 flex-shrink-0"
                                        style={{ backgroundColor: settings.backgroundColor }}
                                    />
                                    <div className="flex-1 text-left min-w-0">
                                        <div className="text-xs md:text-sm font-bold text-gray-900">Custom Color</div>
                                        <div className="text-xs text-gray-500 font-mono mt-1 truncate">{settings.backgroundColor}</div>
                                    </div>
                                    <Palette className="h-4 md:h-5 w-4 md:w-5 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" />
                                </button>

                                {showColorPicker && (
                                    <div className="mt-4 md:mt-6 p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl md:rounded-2xl border border-gray-200/50">
                                        <HexColorPicker
                                            color={settings.backgroundColor}
                                            onChange={(color) => setSettings(prev => ({ ...prev, backgroundColor: color }))}
                                        />
                                        <div className="mt-4 md:mt-5 flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3">
                                            <span className="text-xs md:text-sm font-medium text-gray-700 uppercase tracking-wide">Hex Code</span>
                                            <input
                                                type="text"
                                                value={settings.backgroundColor}
                                                onChange={(e) => setSettings(prev => ({ ...prev, backgroundColor: e.target.value }))}
                                                className="w-full md:flex-1 px-3 md:px-4 py-2 bg-white border border-gray-300 rounded-lg md:rounded-xl text-xs md:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="#000000"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Background Image */}
                        <div className="pt-6 md:pt-8 border-t border-gray-100 space-y-4 md:space-y-5">
                            <label className="block text-xs md:text-sm font-bold text-gray-900 uppercase tracking-wider">Background Image</label>
                            <div className="space-y-3 md:space-y-4">
                                <input
                                    type="text"
                                    value={settings.backgroundImage || ''}
                                    onChange={(e) => setSettings(prev => ({ ...prev, backgroundImage: e.target.value }))}
                                    className="w-full px-3 md:px-5 py-2 md:py-3 border border-gray-300 rounded-lg md:rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="https://example.com/background-image.jpg"
                                />
                                {settings.backgroundImage && (
                                    <div className="p-3 md:p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg md:rounded-xl border border-gray-200/50 space-y-3 md:space-y-4">
                                        <div className="text-xs font-bold text-gray-600 uppercase tracking-wider">Image Preview</div>
                                        <div 
                                            className="w-full h-20 md:h-24 rounded-lg md:rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-all"
                                            style={{
                                                backgroundImage: `url(${settings.backgroundImage})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                backgroundColor: settings.backgroundColor
                                            }}
                                        />
                                        <button
                                            onClick={() => setSettings(prev => ({ ...prev, backgroundImage: '' }))}
                                            className="text-xs font-medium text-red-600 hover:text-red-800 transition-colors"
                                        >
                                            ✕ Remove Background Image
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bar Dimensions */}
                        <div className="pt-6 md:pt-8 border-t border-gray-100 space-y-4 md:space-y-5">
                            <label className="block text-xs md:text-sm font-bold text-gray-900 uppercase tracking-wider">Bar Dimensions</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div className="space-y-2 md:space-y-3">
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Width</label>
                                    <select
                                        value={settings.width || '100%'}
                                        onChange={(e) => setSettings(prev => ({ ...prev, width: e.target.value }))}
                                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg md:rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                                    >
                                        <option value="100%">Full Width (100%)</option>
                                        <option value="90%">90% Width</option>
                                        <option value="80%">80% Width</option>
                                        <option value="1200px">Fixed 1200px</option>
                                        <option value="1000px">Fixed 1000px</option>
                                        <option value="800px">Fixed 800px</option>
                                        <option value="custom">Custom</option>
                                    </select>
                                    {settings.width === 'custom' && (
                                        <input
                                            type="text"
                                            value={settings.customWidth || ''}
                                            onChange={(e) => setSettings(prev => ({ ...prev, customWidth: e.target.value }))}
                                            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg md:rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            placeholder="e.g., 500px, 75%, 50vw"
                                        />
                                    )}
                                </div>
                                <div className="space-y-2 md:space-y-3">
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Height</label>
                                    <select
                                        value={settings.height || 'auto'}
                                        onChange={(e) => setSettings(prev => ({ ...prev, height: e.target.value }))}
                                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg md:rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                                    >
                                        <option value="auto">Auto Height</option>
                                        <option value="60px">Small (60px)</option>
                                        <option value="80px">Medium (80px)</option>
                                        <option value="100px">Large (100px)</option>
                                        <option value="120px">Extra Large (120px)</option>
                                        <option value="custom">Custom</option>
                                    </select>
                                    {settings.height === 'custom' && (
                                        <input
                                            type="text"
                                            value={settings.customHeight || ''}
                                            onChange={(e) => setSettings(prev => ({ ...prev, customHeight: e.target.value }))}
                                            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg md:rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            placeholder="e.g., 150px, 10vh, 5rem"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Template Selector Modal */}
            {showTemplateSelector && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-8 border-b border-gray-100/50 sticky top-0 bg-white backdrop-blur-xl rounded-t-3xl">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-2xl font-bold text-gray-900">Choose Template</h2>
                                <button
                                    onClick={() => setShowTemplateSelector(false)}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <p className="text-gray-500">Select a template to get started with your announcement</p>
                        </div>
                        
                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {templates.map((template) => {
                                    const IconComponent = template.icon;
                                    return (
                                        <button
                                            key={template.id}
                                            onClick={() => selectTemplate(template.id)}
                                            className="text-left p-6 border border-gray-200/50 rounded-2xl hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 group bg-gradient-to-br from-white to-gray-50/50 hover:from-blue-50 hover:to-indigo-50"
                                        >
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl group-hover:from-blue-200 group-hover:to-indigo-200 transition-all duration-200">
                                                    <IconComponent className="h-6 w-6 text-blue-600" />
                                                </div>
                                                <h3 className="font-bold text-gray-900 text-lg">{template.name}</h3>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description}</p>
                                            <div className="text-xs text-gray-600 bg-gray-100/50 rounded-xl p-3 font-mono border border-gray-200/50 line-clamp-2">
                                                {template.preview}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </>
    );
};

// Helper Components
const AnnouncementBarPreview = ({ settings }) => {
    const renderBlock = (block) => {
        const baseClasses = `${block.styles?.fontSize || 'text-sm'} ${block.styles?.fontWeight || 'font-medium'}`;
        const textStyle = {
            color: block.styles?.color || '#ffffff',
            textShadow: block.styles?.textShadow,
            textDecoration: block.styles?.textDecoration
        };

        switch (block.type) {
            case 'text':
            case 'highlight':
                return (
                    <span key={block.id} className={baseClasses} style={textStyle}>
                        {block.content}
                    </span>
                );
            case 'icon':
                return (
                    <span key={block.id} className={block.styles?.fontSize || 'text-lg'}>
                        {block.content}
                    </span>
                );
            case 'link':
                return (
                    <a
                        key={block.id}
                        href={block.url || '#'}
                        className={baseClasses}
                        style={textStyle}
                        onClick={(e) => e.preventDefault()}
                    >
                        {block.content}
                    </a>
                );
            case 'button':
                return (
                    <button
                        key={block.id}
                        className={`${baseClasses} ${block.styles?.padding || 'px-4 py-2'} ${block.styles?.borderRadius || 'rounded-lg'}`}
                        style={{
                            backgroundColor: block.styles?.backgroundColor || '#ffffff',
                            color: block.styles?.color || '#000000'
                        }}
                        onClick={(e) => e.preventDefault()}
                    >
                        {block.content}
                    </button>
                );
            case 'image':
                if (!block.url) {
                    return (
                        <span key={block.id} className="text-red-400 text-xs">
                            [No Image URL]
                        </span>
                    );
                }
                return (
                    <img
                        key={block.id}
                        src={block.url}
                        alt={block.content || 'Announcement image'}
                        className="inline-block mx-1"
                        style={{
                            width: block.width || '24px',
                            height: block.height || '24px',
                            objectFit: 'contain',
                            border: '1px solid rgba(255,255,255,0.3)'
                        }}
                        onLoad={(e) => {
                            console.log('✅ Image loaded in preview:', block.url);
                        }}
                        onError={(e) => {
                            console.error('❌ Image failed in preview:', block.url);
                            e.target.outerHTML = `<span style="color: #ff6b6b; font-size: 12px;">[Image Error]</span>`;
                        }}
                    />
                );
            case 'background':
                return null; // Background images are handled in the container
            case 'html':
                return <div key={block.id} dangerouslySetInnerHTML={{ __html: block.content }} />;
            default:
                return null;
        }
    };

    const backgroundBlock = settings.content?.blocks?.find(block => block.type === 'background');
    const contentBlocks = settings.content?.blocks?.filter(block => block.type !== 'background') || [];

    const getActualDimension = (dimension, customValue) => {
        if (dimension === 'custom') return customValue || 'auto';
        return dimension;
    };

    return (
        <div 
            className="relative text-white text-sm font-medium py-3 px-4 text-center flex items-center justify-center flex-wrap gap-1 mx-auto"
            style={{ 
                backgroundColor: settings.backgroundColor,
                backgroundImage: settings.backgroundImage ? `url(${settings.backgroundImage})` : (backgroundBlock ? `url(${backgroundBlock.url})` : undefined),
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                width: getActualDimension(settings.width, settings.customWidth),
                height: getActualDimension(settings.height, settings.customHeight),
                minHeight: settings.height === 'auto' ? '48px' : undefined
            }}
        >
            {contentBlocks.map(renderBlock)}
        </div>
    );
};

const ContentBlock = ({ 
    block, 
    index, 
    totalBlocks, 
    onUpdate, 
    onUpdateStyle, 
    onRemove, 
    onMove, 
    isSelected, 
    onSelect 
}) => {
    const getBlockIcon = (type) => {
        switch (type) {
            case 'text': return Type;
            case 'highlight': return Sparkles;
            case 'icon': return Sparkles;
            case 'link': return Link;
            case 'button': return Gift;
            case 'image': return Image;
            case 'html': return Edit3;
            default: return Type;
        }
    };

    const BlockIcon = getBlockIcon(block.type);

    return (
        <div className={`border rounded-2xl p-6 transition-all duration-300 backdrop-blur-sm ${
            isSelected 
                ? 'border-blue-300/50 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg shadow-blue-500/10' 
                : 'border-gray-200/50 bg-white hover:border-gray-300/50 hover:shadow-md'
        }`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg">
                        <BlockIcon className="h-4 w-4 text-gray-600" />
                    </div>
                    <span className="text-sm font-bold text-gray-900 uppercase tracking-wide capitalize">{block.type}</span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onMove('up')}
                        disabled={index === 0}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onMove('down')}
                        disabled={index === totalBlocks - 1}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        <ChevronDown className="h-4 w-4" />
                    </button>
                    <button
                        onClick={onSelect}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    >
                        <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                        onClick={onRemove}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {/* Content Input */}
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                        {block.type === 'html' ? 'HTML Code' : 'Content'}
                    </label>
                    {block.type === 'html' && isSelected ? (
                        <div className="space-y-3">
                            <textarea
                                value={block.content}
                                onChange={(e) => onUpdate('content', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono bg-white"
                                placeholder="Enter your HTML code here..."
                                rows={8}
                                style={{
                                    resize: 'vertical',
                                    minHeight: '200px'
                                }}
                            />
                            <div className="flex items-start gap-2 text-xs text-gray-500">
                                <span className="text-lg">💡</span>
                                <span>You can use HTML tags like &lt;span&gt;, &lt;div&gt;, &lt;strong&gt;, etc.</span>
                            </div>
                            {/* HTML Preview */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Preview</label>
                                <div 
                                    className="border border-gray-200 rounded-xl p-4 bg-gradient-to-br from-red-600 to-red-700 min-h-[60px] text-white shadow-sm"
                                    dangerouslySetInnerHTML={{ __html: block.content }}
                                />
                            </div>
                        </div>
                    ) : (
                        <input
                            type="text"
                            value={block.content}
                            onChange={(e) => onUpdate('content', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                            placeholder={block.type === 'html' ? 'Click edit button to expand HTML editor' : `Enter ${block.type} content`}
                        />
                    )}
                </div>

                {/* Image Preview */}
                {block.type === 'image' && block.url && (
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Preview</label>
                        <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 flex items-center justify-center">
                            <img
                                src={block.url}
                                alt={block.content || 'Preview'}
                                style={{
                                    width: block.width || '24px',
                                    height: block.height || '24px',
                                    objectFit: 'contain',
                                    maxWidth: '100%',
                                    maxHeight: '120px'
                                }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextElementSibling.style.display = 'block';
                                }}
                            />
                            <div 
                                className="text-red-500 text-xs hidden"
                                style={{ display: 'none' }}
                            >
                                Image failed to load
                            </div>
                        </div>
                    </div>
                )}

                {/* URL Input for links, buttons, and images */}
                {(block.type === 'link' || block.type === 'button') && (
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">URL</label>
                        <input
                            type="text"
                            value={block.url || ''}
                            onChange={(e) => onUpdate('url', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                            placeholder="https://example.com"
                        />
                    </div>
                )}

                {/* Image specific inputs */}
                {block.type === 'image' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Image URL</label>
                            <input
                                type="text"
                                value={block.url || ''}
                                onChange={(e) => onUpdate('url', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Width</label>
                                <input
                                    type="text"
                                    value={block.width || ''}
                                    onChange={(e) => onUpdate('width', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                                    placeholder="24px or auto"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Height</label>
                                <input
                                    type="text"
                                    value={block.height || ''}
                                    onChange={(e) => onUpdate('height', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                                    placeholder="24px or auto"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Advanced styling when selected */}
                {isSelected && (
                    <div className="pt-4 border-t border-gray-200/50 space-y-4">
                        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Style Options</h4>
                        
                        {/* Button-specific styling */}
                        {block.type === 'button' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Radius</label>
                                        <select
                                            value={block.styles?.borderRadius || 'rounded-lg'}
                                            onChange={(e) => onUpdateStyle('borderRadius', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                                        >
                                            <option value="rounded-none">No Radius</option>
                                            <option value="rounded-sm">Small</option>
                                            <option value="rounded-md">Medium</option>
                                            <option value="rounded-lg">Large</option>
                                            <option value="rounded-xl">Extra Large</option>
                                            <option value="rounded-full">Full (Pill)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Background</label>
                                        <input
                                            type="color"
                                            value={block.styles?.backgroundColor || '#ffffff'}
                                            onChange={(e) => onUpdateStyle('backgroundColor', e.target.value)}
                                            className="w-full h-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Text Color</label>
                                    <input
                                        type="color"
                                        value={block.styles?.color || '#000000'}
                                        onChange={(e) => onUpdateStyle('color', e.target.value)}
                                        className="w-full h-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Padding</label>
                                    <select
                                        value={block.styles?.padding || 'px-4 py-2'}
                                        onChange={(e) => onUpdateStyle('padding', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                                    >
                                        <option value="px-2 py-1">Small</option>
                                        <option value="px-3 py-2">Medium</option>
                                        <option value="px-4 py-2">Large</option>
                                        <option value="px-6 py-3">Extra Large</option>
                                    </select>
                                </div>
                            </div>
                        )}
                        
                        {/* General text styling for non-button blocks */}
                        {block.type !== 'button' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Font Size</label>
                                    <select
                                        value={block.styles?.fontSize || 'text-sm'}
                                        onChange={(e) => onUpdateStyle('fontSize', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                                    >
                                        <option value="text-xs">Extra Small</option>
                                        <option value="text-sm">Small</option>
                                        <option value="text-base">Base</option>
                                        <option value="text-lg">Large</option>
                                        <option value="text-xl">Extra Large</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Font Weight</label>
                                    <select
                                        value={block.styles?.fontWeight || 'font-medium'}
                                        onChange={(e) => onUpdateStyle('fontWeight', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                                    >
                                        <option value="font-light">Light</option>
                                        <option value="font-normal">Normal</option>
                                        <option value="font-medium">Medium</option>
                                        <option value="font-semibold">Semi Bold</option>
                                        <option value="font-bold">Bold</option>
                                        <option value="font-black">Black</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Text Color</label>
                                    <input
                                        type="color"
                                        value={block.styles?.color || '#ffffff'}
                                        onChange={(e) => onUpdateStyle('color', e.target.value)}
                                        className="w-full h-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnnouncementAdmin;