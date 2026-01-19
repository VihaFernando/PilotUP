import { X } from "lucide-react";
import { useAnnouncement } from '../contexts/AnnouncementContext';

const AnnouncementBar = () => {
    const { showAnnouncement, announcementSettings, closeAnnouncement, loading } = useAnnouncement();

    // Don't render anything while loading
    if (loading) return null;

    if (!showAnnouncement) return null;

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
                    >
                        {block.content}
                    </a>
                );
            case 'button':
                return (
                    <a
                        key={block.id}
                        href={block.url || '#'}
                        className={`inline-block ${baseClasses} ${block.styles?.padding || 'px-4 py-2'} ${block.styles?.borderRadius || 'rounded-lg'} transition-colors hover:opacity-90`}
                        style={{
                            backgroundColor: block.styles?.backgroundColor || '#ffffff',
                            color: block.styles?.color || '#000000'
                        }}
                    >
                        {block.content}
                    </a>
                );
            case 'image':
                if (!block.url) {
                    return null;
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
                            objectFit: 'contain'
                        }}
                        onLoad={(e) => {
                            console.log('✅ Image loaded in announcement:', block.url);
                        }}
                        onError={(e) => {
                            console.error('❌ Image failed in announcement:', block.url);
                            e.target.style.display = 'none';
                        }}
                    />
                );
            case 'background':
                return null; // Background images are handled in the container
            case 'html':
                return <span key={block.id} dangerouslySetInnerHTML={{ __html: block.content }} />;
            default:
                return null;
        }
    };

    // Handle both new block format and legacy format
    const renderContent = () => {
        if (announcementSettings.content?.blocks) {
            // New block-based format
            const backgroundBlock = announcementSettings.content.blocks.find(block => block.type === 'background');
            const contentBlocks = announcementSettings.content.blocks.filter(block => block.type !== 'background');

            return {
                content: contentBlocks.map(renderBlock),
                backgroundImage: backgroundBlock?.url
            };
        } else {
            // Legacy format
            return {
                content: (
                    <span className="leading-tight">
                        {announcementSettings.content.text} {" "}
                        <span className="font-semibold">{announcementSettings.content.highlight}</span> {" "}
                        {announcementSettings.content.additionalText} {" "}
                        <a href={announcementSettings.content.linkUrl} className="underline font-semibold hover:text-white/90">
                            {announcementSettings.content.linkText}
                        </a>
                    </span>
                ),
                backgroundImage: null
            };
        }
    };

    const { content, backgroundImage } = renderContent();

    const getActualDimension = (dimension, customValue) => {
        if (dimension === 'custom') return customValue || 'auto';
        return dimension;
    };

    return (
        <div className="flex justify-center w-full">
            <div
                className="relative text-white text-xs sm:text-sm font-medium py-0.5 sm:py-1 px-1.5 sm:px-2 text-center flex items-center justify-center flex-wrap gap-1"
                style={{
                    backgroundColor: announcementSettings.backgroundColor,
                    backgroundImage: announcementSettings.backgroundImage
                        ? `url(${announcementSettings.backgroundImage})`
                        : (backgroundImage ? `url(${backgroundImage})` : undefined),
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    width: getActualDimension(announcementSettings.width || '100%', announcementSettings.customWidth),
                    height: getActualDimension(announcementSettings.height || 'auto', announcementSettings.customHeight),
                    minHeight: (announcementSettings.height === 'auto' || !announcementSettings.height) ? '34px' : undefined
                }}
            >
                {content}
                <button
                    type="button"
                    aria-label="Close announcement"
                    onClick={closeAnnouncement}
                    className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/15 transition"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default AnnouncementBar;