document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Functionality
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        // Update icon
        const icon = themeToggle.querySelector('i');
        if (body.classList.contains('dark-mode')) {
            icon.className = 'fa-solid fa-sun';
            localStorage.setItem('theme', 'dark');
        } else {
            icon.className = 'fa-solid fa-moon';
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.querySelector('i').className = 'fa-solid fa-sun';
    }
    
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const actions = document.querySelector('.actions');
    
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        actions.classList.toggle('active');
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                navLinks.classList.remove('active');
                actions.classList.remove('active');
            }
        });
    });
    
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other open FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
    
    // Tab Functionality in Advanced Features section
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Hide all tab content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Show the corresponding tab content
            const targetId = tab.getAttribute('data-tab');
            document.getElementById(targetId).classList.add('active');
        });
    });
    
    // File Upload Functionality
    const dropArea = document.getElementById('dropArea');
    const fileInput = document.getElementById('fileInput');
    const convertBtn = document.getElementById('convertBtn');
    const conversionProgress = document.getElementById('conversionProgress');
    const progressFill = document.querySelector('.progress-fill');
    const progressPercent = document.getElementById('progressPercent');
    const conversionResult = document.getElementById('conversionResult');
    
    // AI Enhancement Preview Elements
    const enhanceVisualsCheckbox = document.getElementById('enhanceVisuals');
    const aiSuggestionsCheckbox = document.getElementById('aiSuggestions');
    const previewContainer = document.createElement('div');
    previewContainer.className = 'ai-preview-container hidden';
    previewContainer.innerHTML = `
        <h3>AI Processing Preview</h3>
        <div class="ai-preview-content">
            <div class="ai-actions">
                <div class="ai-action-item">
                    <span class="ai-label">Visual Enhancement</span>
                    <div class="ai-sample-display visual-enhancement"></div>
                </div>
                <div class="ai-action-item">
                    <span class="ai-label">Content Suggestions</span>
                    <div class="ai-sample-display content-suggestions"></div>
                </div>
            </div>
        </div>
    `;
    
    // Add AI Preview container after conversion options
    const optionsContainer = document.querySelector('.conversion-options');
    if (optionsContainer) {
        optionsContainer.parentNode.insertBefore(previewContainer, optionsContainer.nextSibling);
    }
    
    // Toggle AI Preview based on checkbox state
    function updateAIPreview() {
        const visualEnhancement = previewContainer.querySelector('.visual-enhancement');
        const contentSuggestions = previewContainer.querySelector('.content-suggestions');
        
        if (enhanceVisualsCheckbox.checked || aiSuggestionsCheckbox.checked) {
            previewContainer.classList.remove('hidden');
            
            if (enhanceVisualsCheckbox.checked) {
                visualEnhancement.innerHTML = `
                    <div class="comparison">
                        <div class="before">
                            <small>Before</small>
                            <div class="sample-image grayscale"></div>
                        </div>
                        <div class="after">
                            <small>After</small>
                            <div class="sample-image enhanced"></div>
                        </div>
                    </div>
                    <p>Charts enhanced with color schemes, improved resolution, and professional styling</p>
                `;
                visualEnhancement.classList.remove('disabled');
            } else {
                visualEnhancement.innerHTML = '<p class="disabled-text">Visual enhancement disabled</p>';
                visualEnhancement.classList.add('disabled');
            }
            
            if (aiSuggestionsCheckbox.checked) {
                contentSuggestions.innerHTML = `
                    <div class="suggestion-examples">
                        <div class="suggestion-item">
                            <i class="fas fa-lightbulb"></i>
                            <span>Added bullet points for clarity</span>
                        </div>
                        <div class="suggestion-item">
                            <i class="fas fa-font"></i>
                            <span>Improved title formatting</span>
                        </div>
                        <div class="suggestion-item">
                            <i class="fas fa-align-left"></i>
                            <span>Enhanced content structure</span>
                        </div>
                    </div>
                `;
                contentSuggestions.classList.remove('disabled');
            } else {
                contentSuggestions.innerHTML = '<p class="disabled-text">Content suggestions disabled</p>';
                contentSuggestions.classList.add('disabled');
            }
        } else {
            previewContainer.classList.add('hidden');
        }
    }
    
    // Add event listeners for AI option checkboxes
    enhanceVisualsCheckbox.addEventListener('change', updateAIPreview);
    aiSuggestionsCheckbox.addEventListener('change', updateAIPreview);
    
    // Enable convert button when file is selected
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            convertBtn.disabled = false;
            // Display selected file name
            dropArea.querySelector('h3').textContent = e.target.files[0].name;
            
            // Show AI preview if options are selected
            updateAIPreview();
        } else {
            convertBtn.disabled = true;
            dropArea.querySelector('h3').textContent = 'Drag & Drop Files Here';
            previewContainer.classList.add('hidden');
        }
    });
    
    // Handle drop area click
    dropArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Handle drag and drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        dropArea.style.borderColor = 'var(--primary-color)';
        dropArea.style.backgroundColor = 'rgba(106, 90, 205, 0.05)';
    }
    
    function unhighlight() {
        dropArea.style.borderColor = 'var(--border-color)';
        dropArea.style.backgroundColor = '';
    }
    
    dropArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            fileInput.files = files;
            convertBtn.disabled = false;
            dropArea.querySelector('h3').textContent = files[0].name;
            
            // Show AI preview if options are selected
            updateAIPreview();
        }
    }
    
    // Handle conversion process
    convertBtn.addEventListener('click', () => {
        // Get option values
        const selectedTheme = document.getElementById('theme').value;
        const enhanceVisuals = document.getElementById('enhanceVisuals').checked;
        const aiSuggestions = document.getElementById('aiSuggestions').checked;
        
        // Show progress bar
        dropArea.style.display = 'none';
        document.querySelector('.conversion-options').style.display = 'none';
        previewContainer.classList.add('hidden');
        convertBtn.style.display = 'none';
        conversionProgress.classList.remove('hidden');
        
        // Simulate conversion progress with different stages
        let progress = 0;
        const stages = [
            { value: 20, message: 'Analyzing PDF structure...' },
            { value: 40, message: 'Extracting text and images...' },
            { value: 60, message: 'Generating slides...' },
            { value: 80, message: enhanceVisuals ? 'Enhancing visuals using AI...' : 'Applying theme and formatting...' },
            { value: 90, message: aiSuggestions ? 'Applying AI content suggestions...' : 'Finalizing presentation...' },
            { value: 100, message: 'Conversion complete!' }
        ];
        
        let currentStage = 0;
        
        const interval = setInterval(() => {
            if (currentStage < stages.length) {
                const stage = stages[currentStage];
                progress = stage.value;
                
                progressFill.style.width = ${progress}%;
                progressPercent.textContent = ${Math.round(progress)}%;
                document.querySelector('.progress-text').textContent = ${stage.message} ${Math.round(progress)}%;
                
                currentStage++;
            }
            
            if (progress >= 100) {
                clearInterval(interval);
                
                // Show result after a short delay
                setTimeout(() => {
                    conversionProgress.classList.add('hidden');
                    conversionResult.classList.remove('hidden');
                    
                    // Update result message based on selected options
                    let resultMessage = 'Your PDF has been successfully converted to PowerPoint';
                    if (enhanceVisuals) {
                        resultMessage += ' with enhanced visuals';
                    }
                    if (aiSuggestions) {
                        resultMessage += enhanceVisuals ? ' and' : ' with';
                        resultMessage += ' AI content suggestions';
                    }
                    
                    document.querySelector('.conversion-result p').textContent = resultMessage;
                    
                    // Add visual indicators for applied enhancements with details
                    // Remove any existing enhancement list
                    const existingList = document.querySelector('.enhancements-applied');
                    if (existingList) {
                        existingList.remove();
                    }
                    
                    const enhancementsList = document.createElement('ul');
                    enhancementsList.className = 'enhancements-applied';
                    
                    if (enhanceVisuals) {
                        const item = document.createElement('li');
                        item.innerHTML = '<i class="fas fa-check-circle"></i> Visual enhancements applied';
                        
                        // Add details list
                        const details = document.createElement('ul');
                        details.className = 'enhancement-details';
                        details.innerHTML = `
                            <li>Improved image resolution by 200%</li>
                            <li>Enhanced color balance and contrast</li>
                            <li>Redesigned charts with professional styling</li>
                            <li>Optimized layout for better visual hierarchy</li>
                        `;
                        item.appendChild(details);
                        enhancementsList.appendChild(item);
                    }
                    
                    if (aiSuggestions) {
                        const item = document.createElement('li');
                        item.innerHTML = '<i class="fas fa-check-circle"></i> AI content suggestions applied';
                        
                        // Add details list
                        const details = document.createElement('ul');
                        details.className = 'enhancement-details';
                        details.innerHTML = `
                            <li>Improved slide titles for clarity</li>
                            <li>Added bullet points to structure content</li>
                            <li>Fixed grammatical errors and typos</li>
                            <li>Optimized content structure for better flow</li>
                        `;
                        item.appendChild(details);
                        enhancementsList.appendChild(item);
                    }
                    
                    // Insert after the result paragraph
                    const resultP = document.querySelector('.conversion-result p');
                    resultP.parentNode.insertBefore(enhancementsList, resultP.nextSibling);
                    
                    // Add sharing options to the result area
                    const sharingContainer = document.createElement('div');
                    sharingContainer.className = 'sharing-options';
                    sharingContainer.innerHTML = `
                        <h4>Share Presentation:</h4>
                        <div class="share-buttons">
                            <button class="share-btn email"><i class="fas fa-envelope"></i> Email</button>
                            <button class="share-btn link"><i class="fas fa-link"></i> Copy Link</button>
                            <button class="share-btn drive"><i class="fab fa-google-drive"></i> Google Drive</button>
                            <button class="share-btn teams"><i class="fas fa-users"></i> Microsoft Teams</button>
                        </div>
                    `;
                    
                    // Add sharing container after enhancements list
                    resultP.parentNode.insertBefore(sharingContainer, enhancementsList.nextSibling);
                    
                    // Add event listeners for share buttons
                    const shareButtons = sharingContainer.querySelectorAll('.share-btn');
                    shareButtons.forEach(button => {
                        button.addEventListener('click', () => {
                            const shareType = button.classList[1];
                            let message = '';
                            
                            switch (shareType) {
                                case 'email':
                                    message = 'Presentation ready to email';
                                    // Simulate email sharing dialog
                                    showSharingDialog('email');
                                    break;
                                case 'link':
                                    message = 'Link copied to clipboard!';
                                    // Simulate copying a link
                                    navigator.clipboard.writeText('https://docuelevator.com/share/presentation123456')
                                        .then(() => {
                                            showNotification(message, 'success');
                                        })
                                        .catch(() => {
                                            showNotification('Failed to copy link', 'error');
                                        });
                                    break;
                                case 'drive':
                                    message = 'Uploading to Google Drive...';
                                    showSharingDialog('drive');
                                    break;
                                case 'teams':
                                    message = 'Sharing to Microsoft Teams...';
                                    showSharingDialog('teams');
                                    break;
                            }
                            
                            if (shareType !== 'link') {
                                showNotification(message, 'info');
                            }
                        });
                    });
                    
                }, 500);
            }
        }, 800);
    });
    
    // Create sharing dialog modal
    function createSharingDialog() {
        const sharingDialog = document.createElement('div');
        sharingDialog.id = 'sharingModal';
        sharingDialog.className = 'modal';
        sharingDialog.innerHTML = `
            <div class="modal-content sharing-modal">
                <span class="close-modal">&times;</span>
                <h2 class="sharing-title">Share Presentation</h2>
                <div class="sharing-form-container">
                    <!-- Content will be dynamically updated -->
                </div>
                <div class="modal-actions">
                    <button class="btn btn-outline cancel-sharing">Cancel</button>
                    <button class="btn btn-primary confirm-sharing">Share</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(sharingDialog);
        
        // Add event listeners for close buttons
        const closeButtons = sharingDialog.querySelectorAll('.close-modal, .cancel-sharing');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                sharingDialog.classList.remove('active');
            });
        });
        
        // Close when clicking outside
        sharingDialog.addEventListener('click', (e) => {
            if (e.target === sharingDialog) {
                sharingDialog.classList.remove('active');
            }
        });
        
        // Handle share button
        const confirmButton = sharingDialog.querySelector('.confirm-sharing');
        confirmButton.addEventListener('click', () => {
            sharingDialog.classList.remove('active');
            showNotification('Your presentation has been shared successfully!', 'success');
        });
        
        return sharingDialog;
    }
    
    // Show sharing dialog for different services
    function showSharingDialog(type) {
        let sharingDialog = document.getElementById('sharingModal');
        if (!sharingDialog) {
            sharingDialog = createSharingDialog();
        }
        
        const formContainer = sharingDialog.querySelector('.sharing-form-container');
        const title = sharingDialog.querySelector('.sharing-title');
        
        // Update content based on sharing type
        switch (type) {
            case 'email':
                title.textContent = 'Share via Email';
                formContainer.innerHTML = `
                    <div class="form-group">
                        <label for="emailTo">To:</label>
                        <input type="email" id="emailTo" placeholder="recipient@example.com" multiple>
                    </div>
                    <div class="form-group">
                        <label for="emailSubject">Subject:</label>
                        <input type="text" id="emailSubject" value="PowerPoint Presentation from DocuElevator">
                    </div>
                    <div class="form-group">
                        <label for="emailMessage">Message:</label>
                        <textarea id="emailMessage" rows="3" placeholder="Add a message (optional)"></textarea>
                    </div>
                `;
                break;
            case 'drive':
                title.textContent = 'Share to Google Drive';
                formContainer.innerHTML = `
                    <div class="google-account-selector">
                        <h4>Select Google Account</h4>
                        <div class="account-item">
                            <input type="radio" name="google-account" id="google1" checked>
                            <label for="google1">user@gmail.com</label>
                        </div>
                        <div class="account-item">
                            <input type="radio" name="google-account" id="google2">
                            <label for="google2">Add another account...</label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="driveFolderPath">Folder:</label>
                        <select id="driveFolderPath">
                            <option value="root">My Drive</option>
                            <option value="presentations">Presentations</option>
                            <option value="work">Work Documents</option>
                        </select>
                    </div>
                    <div class="sharing-options">
                        <label><input type="checkbox" checked> Convert to Google Slides</label>
                    </div>
                `;
                break;
            case 'teams':
                title.textContent = 'Share to Microsoft Teams';
                formContainer.innerHTML = `
                    <div class="form-group">
                        <label for="teamsChannel">Team/Channel:</label>
                        <select id="teamsChannel">
                            <option value="">Select Team/Channel</option>
                            <option value="marketing">Marketing - General</option>
                            <option value="sales">Sales Team - Presentations</option>
                            <option value="project">Project X - Documents</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="teamsMessage">Message:</label>
                        <textarea id="teamsMessage" rows="3" placeholder="Add a message (optional)"></textarea>
                    </div>
                    <div class="sharing-options">
                        <label><input type="checkbox" checked> Notify channel members</label>
                    </div>
                `;
                break;
        }
        
        sharingDialog.classList.add('active');
    }
    
    // Download and Edit buttons
    const downloadBtn = document.getElementById('downloadBtn');
    const editBtn = document.getElementById('editBtn');
    const editorModal = document.getElementById('editorModal');
    
    downloadBtn.addEventListener('click', () => {
        // Create a link to download a file
        const link = document.createElement('a');
        link.href = 'sample.pptx'; // You'll need to create this file
        link.download = 'DocuElevator_Presentation.pptx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('Download started. Your file will be saved to your downloads folder.', 'success');
    });
    
    editBtn.addEventListener('click', () => {
        editorModal.classList.add('active');
    });
    
    // Modal functionality
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal, .cancel-payment, .cancel-contact');
    
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            modals.forEach(modal => {
                modal.classList.remove('active');
            });
        });
    });
    
    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Pricing plan selection
    const planButtons = document.querySelectorAll('.plan-btn');
    const paymentModal = document.getElementById('paymentModal');
    const contactModal = document.getElementById('contactModal');
    const selectedPlanName = document.getElementById('selectedPlanName');
    const selectedPlanPrice = document.getElementById('selectedPlanPrice');
    
    planButtons.forEach(button => {
        button.addEventListener('click', () => {
            const planCard = button.closest('.pricing-card');
            const planName = planCard.querySelector('h3').textContent;
            const planPriceElement = planCard.querySelector('.price') || planCard.querySelector('.contact-price');
            const planPrice = planPriceElement.textContent;
            
            if (planName === 'Enterprise Plan') {
                // Open contact modal for Enterprise Plan
                contactModal.classList.add('active');
                document.getElementById('subject').value = 'sales';
            } else {
                // Open payment modal for other plans
                selectedPlanName.textContent = planName;
                selectedPlanPrice.textContent = planPrice;
                paymentModal.classList.add('active');
            }
        });
    });
    
    // Handle payment submission
    const confirmPaymentBtn = document.querySelector('.confirm-payment');
    
    confirmPaymentBtn.addEventListener('click', () => {
        const form = document.getElementById('checkoutForm');
        
        // Simple form validation
        const inputs = form.querySelectorAll('input, select');
        let isValid = true;
        
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value) {
                input.style.borderColor = 'var(--error-color)';
                isValid = false;
            } else {
                input.style.borderColor = 'var(--border-color)';
            }
        });
        
        if (isValid) {
            paymentModal.classList.remove('active');
            showNotification('Payment successful! Your account has been upgraded.', 'success');
        } else {
            showNotification('Please fill in all required fields.', 'error');
        }
    });
    
    // Handle contact form submission
    const sendMessageBtn = document.querySelector('.send-message');
    
    sendMessageBtn.addEventListener('click', () => {
        const form = document.getElementById('contactForm');
        
        // Simple form validation
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value) {
                input.style.borderColor = 'var(--error-color)';
                isValid = false;
            } else {
                input.style.borderColor = 'var(--border-color)';
            }
        });
        
        if (isValid) {
            contactModal.classList.remove('active');
            showNotification('Your message has been sent! We\'ll get back to you soon.', 'success');
        } else {
            showNotification('Please fill in all required fields.', 'error');
        }
    });
    
    // Notification System
    const notification = document.getElementById('notification');
    const notificationMessage = document.querySelector('.notification-message');
    const notificationIcon = document.querySelector('.notification-icon');
    const notificationClose = document.querySelector('.notification-close');
    
    function showNotification(message, type = 'info') {
        notification.className = 'notification';
        notification.classList.add(type, 'active');
        
        notificationMessage.textContent = message;
        
        // Set appropriate icon
        switch (type) {
            case 'success':
                notificationIcon.className = 'notification-icon fas fa-check-circle';
                break;
            case 'error':
                notificationIcon.className = 'notification-icon fas fa-exclamation-circle';
                break;
            case 'warning':
                notificationIcon.className = 'notification-icon fas fa-exclamation-triangle';
                break;
            default:
                notificationIcon.className = 'notification-icon fas fa-info-circle';
        }
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            notification.classList.remove('active');
        }, 5000);
    }
    
    notificationClose.addEventListener('click', () => {
        notification.classList.remove('active');
    });
    
    // Function to scroll to converter section - FIXED implementation
    function scrollToConverter(e) {
        if (e) e.preventDefault();
        const converterSection = document.getElementById('converter');
        if (converterSection) {
            window.scrollTo({
                top: converterSection.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    }
    
    // Find all elements with text content containing "Learn More"
    document.querySelectorAll('a, button, .btn').forEach(element => {
        if (element.textContent.trim().includes('Learn More')) {
            // Remove any existing click listeners (to prevent duplicates)
            const newElement = element.cloneNode(true);
            element.parentNode.replaceChild(newElement, element);
            
            // Add new event listener
            newElement.addEventListener('click', scrollToConverter);
        }
    });
    
    // Also target specific classes that might be used for Learn More buttons
    const learnMoreSelectors = [
        '.btn-learn-more', 
        '.learn-more', 
        '.btn-secondary', 
        '.feature-card .btn'
    ];
    
    learnMoreSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(button => {
            if (button.textContent.trim().includes('Learn More')) {
                // Remove any existing click listeners (to prevent duplicates)
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
                
                // Add new event listener
                newButton.addEventListener('click', scrollToConverter);
            }
        });
    });
    
    // Make sure CTA buttons also scroll to converter
    document.querySelectorAll('.cta-button, .hero-section .btn-primary').forEach(button => {
        button.addEventListener('click', scrollToConverter);
    });
    
    // Newsletter subscription
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            
            if (emailInput.value) {
                emailInput.value = '';
                showNotification('Thank you for subscribing to our newsletter!', 'success');
            } else {
                showNotification('Please enter your email address.', 'error');
            }
        });
    }
    
    // Presentation Editor Functionality
    const slideThumbnails = document.querySelectorAll('.slide-thumbnail');
    const toolButtons = document.querySelectorAll('.tool-btn');
    const editorSaveBtn = document.querySelector('.editor-actions .btn-primary');
    const editorCancelBtn = document.querySelector('.editor-actions .btn-outline');
    
    // Add AI Suggestions panel to the editor
    const editorSidebar = document.querySelector('.editor-sidebar');
    if (editorSidebar) {
        const aiSuggestionsPanel = document.createElement('div');
        aiSuggestionsPanel.className = 'ai-suggestions-panel';
        aiSuggestionsPanel.innerHTML = `
            <h3><i class="fas fa-robot"></i> AI Suggestions</h3>
            <div class="suggestion-item">
                <div class="suggestion-header">
                    <span class="suggestion-title">Content Structure</span>
                    <button class="apply-suggestion"><i class="fas fa-magic"></i> Apply</button>
                </div>
                <p>Replace text-heavy slide with bullet points for better readability</p>
            </div>
            <div class="suggestion-item">
                <div class="suggestion-header">
                    <span class="suggestion-title">Visual Enhancement</span>
                    <button class="apply-suggestion"><i class="fas fa-magic"></i> Apply</button>
                </div>
                <p>Replace generic graph with custom chart using brand colors</p>
            </div>
            <div class="suggestion-item">
                <div class="suggestion-header">
                    <span class="suggestion-title">Visual Enhancement</span>
                    <button class="apply-suggestion"><i class="fas fa-magic"></i> Apply</button>
                </div>
                <p>Replace generic graph with custom chart using brand colors</p>
            </div>
            <div class="suggestion-item">
                <div class="suggestion-header">
                    <span class="suggestion-title">Language Improvement</span>
                    <button class="apply-suggestion"><i class="fas fa-magic"></i> Apply</button>
                </div>
                <p>Revise headline to be more impactful and concise</p>
            </div>
            <div class="generate-more">
                <button class="btn-outline btn-sm"><i class="fas fa-sync"></i> Generate More Suggestions</button>
            </div>
        `;
        
        editorSidebar.appendChild(aiSuggestionsPanel);
        
        // Add event listeners for suggestion buttons
        const applyButtons = aiSuggestionsPanel.querySelectorAll('.apply-suggestion');
        applyButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const suggestionItem = e.target.closest('.suggestion-item');
                const suggestionTitle = suggestionItem.querySelector('.suggestion-title').textContent;
                
                // Show application effect
                suggestionItem.classList.add('applying');
                
                setTimeout(() => {
                    suggestionItem.classList.remove('applying');
                    suggestionItem.classList.add('applied');
                    button.innerHTML = '<i class="fas fa-check"></i> Applied';
                    button.disabled = true;
                    
                    showNotification(Applied AI suggestion: ${suggestionTitle}, 'success');
                    
                    // If this is the "Visual Enhancement" suggestion, update the slide preview
                    if (suggestionTitle === 'Visual Enhancement') {
                        const slidePreview = document.querySelector('.presentation-slide');
                        if (slidePreview) {
                            // Update chart or image if it exists
                            const chartElement = slidePreview.querySelector('.chart-placeholder, img, .graph');
                            if (chartElement) {
                                chartElement.classList.add('enhanced');
                                chartElement.style.border = '2px solid var(--primary-color)';
                            }
                        }
                    }
                    
                    // If this is the "Content Structure" suggestion, update content
                    if (suggestionTitle === 'Content Structure') {
                        const slideContent = document.querySelector('.slide-content');
                        if (slideContent) {
                            // Convert paragraph to bullet points
                            const paragraphs = slideContent.querySelectorAll('p');
                            if (paragraphs.length > 0) {
                                const ulElement = document.createElement('ul');
                                ulElement.className = 'enhanced-bullets';
                                
                                paragraphs.forEach(p => {
                                    if (p.textContent.length > 20) {
                                        const sentences = p.textContent.split('. ');
                                        sentences.forEach(sentence => {
                                            if (sentence.trim().length > 0) {
                                                const li = document.createElement('li');
                                                li.textContent = sentence.trim() + (sentence.endsWith('.') ? '' : '.');
                                                ulElement.appendChild(li);
                                            }
                                        });
                                        
                                        if (p.parentNode) {
                                            p.parentNode.replaceChild(ulElement, p);
                                        }
                                    }
                                });
                            }
                        }
                    }
                    
                    // If this is the "Language Improvement" suggestion, update headline
                    if (suggestionTitle === 'Language Improvement') {
                        const heading = document.querySelector('.slide-content h1, .slide-content h2');
                        if (heading) {
                            const originalText = heading.textContent;
                            heading.innerHTML = <span class="enhanced-text">${originalText}</span>;
                            
                            // Simulate AI improving the heading
                            setTimeout(() => {
                                const improvedText = originalText.includes('Overview') ? 
                                    'Key Insights at a Glance' : 
                                    (originalText.includes('Results') ? 
                                        'Breakthrough Results & Impact' : 
                                        'Strategic Vision & Implementation');
                                
                                heading.innerHTML = <span class="enhanced-text highlight">${improvedText}</span>;
                            }, 800);
                        }
                    }
                }, 1000);
            });
        });
        
        // Generate more suggestions button
        const generateMoreBtn = aiSuggestionsPanel.querySelector('.generate-more button');
        if (generateMoreBtn) {
            generateMoreBtn.addEventListener('click', () => {
                // Show loading state
                generateMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
                generateMoreBtn.disabled = true;
                
                // Simulate AI generating new suggestions
                setTimeout(() => {
                    // Create new suggestion
                    const newSuggestion = document.createElement('div');
                    newSuggestion.className = 'suggestion-item new-suggestion';
                    newSuggestion.innerHTML = `
                        <div class="suggestion-header">
                            <span class="suggestion-title">Data Visualization</span>
                            <button class="apply-suggestion"><i class="fas fa-magic"></i> Apply</button>
                        </div>
                        <p>Convert numeric data to interactive chart for better engagement</p>
                    `;
                    
                    // Add event listener to new button
                    const newButton = newSuggestion.querySelector('.apply-suggestion');
                    newButton.addEventListener('click', () => {
                        newSuggestion.classList.add('applying');
                        
                        setTimeout(() => {
                            newSuggestion.classList.remove('applying');
                            newSuggestion.classList.add('applied');
                            newButton.innerHTML = '<i class="fas fa-check"></i> Applied';
                            newButton.disabled = true;
                            
                            showNotification('Applied AI suggestion: Data Visualization', 'success');
                        }, 1000);
                    });
                    
                    // Insert before the "Generate More" button
                    generateMoreBtn.parentNode.parentNode.insertBefore(newSuggestion, generateMoreBtn.parentNode);
                    
                    // Reset button
                    generateMoreBtn.innerHTML = '<i class="fas fa-sync"></i> Generate More Suggestions';
                    generateMoreBtn.disabled = false;
                }, 2000);
            });
        }
    }
    
    slideThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            slideThumbnails.forEach(t => t.classList.remove('active'));
            thumbnail.classList.add('active');
            
            // Show notification
            showNotification('Slide changed', 'info');
            
            // Reset AI suggestion buttons when changing slides
            const appliedSuggestions = document.querySelectorAll('.suggestion-item.applied');
            appliedSuggestions.forEach(item => {
                item.classList.remove('applied');
                const button = item.querySelector('.apply-suggestion');
                if (button) {
                    button.innerHTML = '<i class="fas fa-magic"></i> Apply';
                    button.disabled = false;
                }
            });
        });
    });
    
    toolButtons.forEach(button => {
        button.addEventListener('click', () => {
            showNotification(${button.getAttribute('title')} functionality would be implemented here, 'info');
        });
    });
    
    if (editorSaveBtn) {
        editorSaveBtn.addEventListener('click', () => {
            editorModal.classList.remove('active');
            showNotification('Your presentation has been saved successfully!', 'success');
        });
    }
    
    if (editorCancelBtn) {
        editorCancelBtn.addEventListener('click', () => {
            editorModal.classList.remove('active');
        });
    }
    
    // Document editor properties functionality
    const colorInputs = document.querySelectorAll('.property-group input[type="color"]');
    const fontSelect = document.querySelector('.property-group select:nth-of-type(1)');
    const fontSizeSelect = document.querySelector('.property-group select:nth-of-type(2)');
    const slidePreview = document.querySelector('.presentation-slide');
    
    if (colorInputs.length && slidePreview) {
        colorInputs.forEach(input => {
            input.addEventListener('change', () => {
                if (input.previousElementSibling && input.previousElementSibling.textContent === 'Text Color') {
                    slidePreview.style.color = input.value;
                } else if (input.previousElementSibling && input.previousElementSibling.textContent === 'Background Color') {
                    slidePreview.style.backgroundColor = input.value;
                }
            });
        });
    }
    
    if (fontSelect && slidePreview) {
        fontSelect.addEventListener('change', () => {
            slidePreview.style.fontFamily = fontSelect.value;
        });
    }
    
    if (fontSizeSelect && slidePreview) {
        fontSizeSelect.addEventListener('change', () => {
            const contentElements = slidePreview.querySelectorAll('*');
            contentElements.forEach(element => {
                if (element.tagName === 'H1') {
                    element.style.fontSize = parseInt(fontSizeSelect.value) * 2 + 'px';
                } else {
                    element.style.fontSize = fontSizeSelect.value + 'px';
                }
            });
        });
    }
    
    // Add suggestion history feature
    function createSuggestionHistory() {
        const historySection = document.createElement('div');
        historySection.className = 'suggestion-history';
        historySection.innerHTML = `
            <h3><i class="fas fa-history"></i> AI Suggestion History</h3>
            <div class="history-list">
                <div class="history-item">
                    <span class="history-time">10:15 AM</span>
                    <span class="history-action">Applied "Content Structure" suggestion</span>
                    <button class="history-undo btn-sm"><i class="fas fa-undo"></i></button>
                </div>
                <div class="history-item">
                    <span class="history-time">10:12 AM</span>
                    <span class="history-action">Applied "Visual Enhancement" suggestion</span>
                    <button class="history-undo btn-sm"><i class="fas fa-undo"></i></button>
                </div>
            </div>
        `;
        
        // Add event listeners for undo buttons
        const undoButtons = historySection.querySelectorAll('.history-undo');
        undoButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const historyItem = e.target.closest('.history-item');
                const action = historyItem.querySelector('.history-action').textContent;
                
                showNotification(Undoing: ${action}, 'info');
                
                // Add visual feedback
                historyItem.classList.add('undoing');
                
                setTimeout(() => {
                    historyItem.remove();
                    
                    // If no more history items, add a message
                    const historyList = historySection.querySelector('.history-list');
                    if (historyList.children.length === 0) {
                        historyList.innerHTML = '<p class="no-history">No suggestion history available</p>';
                    }
                }, 800);
            });
        });
        
        // Check if sidebar exists and append history section
        const sidebar = document.querySelector('.editor-sidebar');
        if (sidebar) {
            sidebar.appendChild(historySection);
        }
    }
    
    // Create suggestion history section in editor
    if (document.querySelector('.editor-sidebar')) {
        createSuggestionHistory();
    }
    
    // File upload restrictions and validation
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                // Check if file is PDF
                if (file.type !== 'application/pdf') {
                    showNotification('Please upload a PDF file.', 'error');
                    fileInput.value = '';
                    convertBtn.disabled = true;
                    dropArea.querySelector('h3').textContent = 'Drag & Drop Files Here';
                    return;
                }
                
                // Check file size (max 10MB)
                if (file.size > 10 * 1024 * 1024) {
                    showNotification('File size exceeds 10MB limit.', 'error');
                    fileInput.value = '';
                    convertBtn.disabled = true;
                    dropArea.querySelector('h3').textContent = 'Drag & Drop Files Here';
                    return;
                }
                
                convertBtn.disabled = false;
                dropArea.querySelector('h3').textContent = file.name;
                showNotification('PDF file ready for conversion.', 'success');
                
                // Update AI preview if options are selected
                updateAIPreview();
            } else {
                convertBtn.disabled = true;
                dropArea.querySelector('h3').textContent = 'Drag & Drop Files Here';
            }
        });
    }
    
    // Add a batch processing feature
    function createBatchProcessingUI() {
        const batchContainer = document.createElement('div');
        batchContainer.className = 'batch-processing-container hidden';
        batchContainer.innerHTML = `
            <h3><i class="fas fa-layer-group"></i> Batch Processing</h3>
            <p>Convert multiple PDF files at once with the same settings</p>
            
            <div class="batch-files-list">
                <div class="no-files">No files added yet</div>
            </div>
            
            <div class="batch-actions">
                <button class="btn-outline btn-sm add-batch-file"><i class="fas fa-plus"></i> Add Files</button>
                <button class="btn-primary btn-sm process-batch" disabled><i class="fas fa-cogs"></i> Process All</button>
            </div>
        `;
        
        // Add batch processing container after drop area
        const converterSection = document.getElementById('converter');
        if (converterSection && dropArea) {
            converterSection.insertBefore(batchContainer, dropArea.nextSibling);
            
            // Add batch processing toggle
            const batchToggle = document.createElement('div');
            batchToggle.className = 'batch-toggle';
            batchToggle.innerHTML = `
                <label class="toggle-label">
                    <input type="checkbox" id="batchModeToggle">
                    <span class="toggle-text">Batch Mode</span>
                </label>
            `;
            
            // Add toggle before drop area
            converterSection.insertBefore(batchToggle, dropArea);
            
            // Add event listener for batch mode toggle
            const batchModeToggle = batchToggle.querySelector('#batchModeToggle');
            batchModeToggle.addEventListener('change', () => {
                if (batchModeToggle.checked) {
                    dropArea.classList.add('hidden');
                    batchContainer.classList.remove('hidden');
                } else {
                    dropArea.classList.remove('hidden');
                    batchContainer.classList.add('hidden');
                }
            });
            
            // Add event listener for add files button
            const addBatchFileBtn = batchContainer.querySelector('.add-batch-file');
            const batchFileInput = document.createElement('input');
            batchFileInput.type = 'file';
            batchFileInput.accept = '.pdf';
            batchFileInput.multiple = true;
            batchFileInput.style.display = 'none';
            batchContainer.appendChild(batchFileInput);
            
            addBatchFileBtn.addEventListener('click', () => {
                batchFileInput.click();
            });
            
            // Handle batch file selection
            batchFileInput.addEventListener('change', (e) => {
                const files = e.target.files;
                if (files.length > 0) {
                    const batchFilesList = batchContainer.querySelector('.batch-files-list');
                    const noFilesMsg = batchFilesList.querySelector('.no-files');
                    
                    if (noFilesMsg) {
                        noFilesMsg.remove();
                    }
                    
                    // Add each file to the list
                    for (let i = 0; i < files.length; i++) {
                        const file = files[i];
                        
                        // Check if file is PDF
                        if (file.type !== 'application/pdf') {
                            showNotification(Skipped ${file.name}: Not a PDF file, 'warning');
                            continue;
                        }
                        
                        // Check file size
                        if (file.size > 10 * 1024 * 1024) {
                            showNotification(Skipped ${file.name}: Exceeds 10MB limit, 'warning');
                            continue;
                        }
                        
                        const fileItem = document.createElement('div');
                        fileItem.className = 'batch-file-item';
                        fileItem.innerHTML = `
                            <span class="file-name">${file.name}</span>
                            <span class="file-size">${(file.size / 1024 / 1024).toFixed(2)} MB</span>
                            <button class="remove-file"><i class="fas fa-times"></i></button>
                            <div class="file-progress">
                                <div class="file-progress-bar"></div>
                            </div>
                        `;
                        
                        // Store the file object in the DOM element
                        fileItem.file = file;
                        
                        // Add remove button functionality
                        const removeBtn = fileItem.querySelector('.remove-file');
                        removeBtn.addEventListener('click', () => {
                            fileItem.remove();
                            
                            // If no more files, add the no files message back
                            if (batchFilesList.children.length === 0) {
                                batchFilesList.innerHTML = '<div class="no-files">No files added yet</div>';
                                batchContainer.querySelector('.process-batch').disabled = true;
                            }
                        });
                        
                        batchFilesList.appendChild(fileItem);
                    }
                    
                    // Enable the process button if files were added
                    if (batchFilesList.children.length > 0) {
                        batchContainer.querySelector('.process-batch').disabled = false;
                    }
                }
            });
            
            // Handle process all button
            const processAllBtn = batchContainer.querySelector('.process-batch');
            processAllBtn.addEventListener('click', () => {
                const fileItems = batchContainer.querySelectorAll('.batch-file-item');
                if (fileItems.length === 0) return;
                
                processAllBtn.disabled = true;
                addBatchFileBtn.disabled = true;
                
                let processedCount = 0;
                const totalFiles = fileItems.length;
                
                // Process each file with a delay between them
                fileItems.forEach((fileItem, index) => {
                    setTimeout(() => {
                        const progressBar = fileItem.querySelector('.file-progress-bar');
                        fileItem.classList.add('processing');
                        
                        // Simulate processing with progress updates
                        let progress = 0;
                        const progressInterval = setInterval(() => {
                            progress += 5;
                            progressBar.style.width = ${progress}%;
                            
                            if (progress >= 100) {
                                clearInterval(progressInterval);
                                fileItem.classList.remove('processing');
                                fileItem.classList.add('completed');
                                
                                processedCount++;
                                
                                // Check if all files are processed
                                if (processedCount === totalFiles) {
                                    showNotification(Processed ${totalFiles} files successfully!, 'success');
                                    processAllBtn.disabled = false;
                                    addBatchFileBtn.disabled = false;
                                    
                                    // Add batch download button
                                    const batchActions = batchContainer.querySelector('.batch-actions');
                                    const downloadAllBtn = document.createElement('button');
                                    downloadAllBtn.className = 'btn-success btn-sm download-all';
                                    downloadAllBtn.innerHTML = '<i class="fas fa-download"></i> Download All';
                                    batchActions.appendChild(downloadAllBtn);
                                    
                                    downloadAllBtn.addEventListener('click', () => {
                                        showNotification('All processed files are being prepared for download', 'info');
                                        
                                        setTimeout(() => {
                                            showNotification('Batch download started', 'success');
                                        }, 1500);
                                    });
                                }
                            }
                        }, 100);
                    }, index * 1000); // Start each file 1 second after the previous one
                });
            });
        }
    }
    
    // Create batch processing UI
    createBatchProcessingUI();
    
    // Enable smooth animations when scrolling to sections
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe all major sections for animation
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
    
    // Handle user testimonials carousel (if added later)
    let currentTestimonial = 0;
    const testimonialInterval = 5000; // 5 seconds
    
    function setupTestimonialCarousel() {
        const testimonials = document.querySelectorAll('.testimonial-item');
        if (testimonials.length > 0) {
            setInterval(() => {
                testimonials.forEach(item => item.classList.remove('active'));
                currentTestimonial = (currentTestimonial + 1) % testimonials.length;
                testimonials[currentTestimonial].classList.add('active');
            }, testimonialInterval);
            
            // Initialize first testimonial
            testimonials[0].classList.add('active');
        }
    }
    
    // Only call if testimonials exist
    if (document.querySelector('.testimonials-carousel')) {
        setupTestimonialCarousel();
    }
    
    // Initialize welcome notification
    showNotification('Welcome to DocuElevator! Start converting your documents now.', 'info');
});