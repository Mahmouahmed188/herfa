# Feature Specification: AI Image Analysis

**Feature Branch**: `013-ai-image-analysis`

**Created**: 2026-06-19

**Status**: Draft

**Input**: User description: Complete the AI Image Analysis feature and fully integrate it with the Backend AI Gateway and FastAPI AI Service. This feature allows users to upload an image of a problem (plumbing, electrical, carpentry, HVAC, painting, appliance repair, etc.) and receive AI-powered analysis, problem detection, classification, severity assessment, and repair recommendations. Architecture: Frontend → NestJS Backend → AI Gateway Module → FastAPI AI Service. All AI requests must flow through the backend. Direct frontend-to-AI communication is prohibited.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Upload and Analyze Problem Image (Priority: P1)

A homeowner with a plumbing issue uploads a photo of a water pipe leak through the mobile app and receives an immediate AI-powered analysis with problem classification, severity level, and recommended repair actions.

**Why this priority**: This is the core value proposition of the feature. Without image upload and analysis, the feature provides no value. Users need to quickly diagnose issues to determine if professional help is needed.

**Independent Test**: Can be fully tested by uploading a water pipe leak image, observing the analysis results, and verifying that problem detection and recommendations are displayed correctly without needing any other functionality.

**Acceptance Scenarios**:

1. **Given** the user is on the AI Image Analysis page, **When** they select a valid image file, **Then** the image is displayed in the preview area with upload status
2. **Given** the user has uploaded a valid image, **When** they submit the analysis, **Then** the system validates the image (format, size) and displays a loading indicator
3. **Given** the analysis is processing, **When** the AI response is received, **Then** the system displays problem title, category, description, confidence score, and severity level
4. **Given** the analysis is complete, **When** the results are displayed, **Then** the user sees problem findings and actionable repair recommendations

---

### User Story 2 - View Detailed Analysis Results (Priority: P2)

After receiving AI analysis results, a user can view detailed findings including problem description, AI findings, and structured recommendations with prioritized actions.

**Why this priority**: While the initial analysis is most critical, users also need to understand the detailed findings and follow recommendations. This ensures users can take appropriate action based on the analysis.

**Independent Test**: Can be tested by submitting a valid image, then reviewing the detailed results including all fields (problem details, findings, recommendations) and verifying they display correctly.

**Acceptance Scenarios**:

1. **Given** the user has received analysis results, **When** they view the details, **Then** they see the problem title, category, and description
2. **Given** the results include AI findings, **When** the user scrolls to the findings section, **Then** they see a structured list of AI-detected issues
3. **Given** the results include recommendations, **When** the user views recommendations, **Then** they see prioritized repair suggestions with safety warnings and required technician types

---

### User Story 3 - Replace or Remove Uploaded Image (Priority: P3)

A user who wants to submit a different image can replace the current image or remove it entirely to upload a new one without page refresh.

**Why this priority**: While convenient, this is an enhancement to the primary flow. Users can always upload a new image through standard flow, but providing replace/remove options improves user experience.

**Independent Test**: Can be tested by uploading an image, then clicking replace or remove to verify the UI updates correctly and allows new image upload.

**Acceptance Scenarios**:

1. **Given** a user has uploaded an image, **When** they click the replace button, **Then** they can select a new image that replaces the previous one
2. **Given** a user has uploaded an image, **When** they click the remove button, **Then** the image is cleared and ready for new upload
3. **Given** a user has submitted an image for analysis, **When** they try to replace or remove, **Then** the system prevents modification of submitted images

---

### User Story 4 - View Analysis History (Priority: P3)

A user can view a history of previous AI analysis results including the original image, analysis date, and a brief summary of results.

**Why this priority**: Historical context is valuable but not essential for the core feature. This should be added if the backend supports it, otherwise documented as a limitation.

**Independent Test**: Can be tested by performing multiple analyses and verifying that previous results appear in the history list with correct display of image, date, and summary.

**Acceptance Scenarios**:

1. **Given** the user has completed multiple analyses, **When** they navigate to the analysis history, **Then** they see a list of previous analyses
2. **Given** an analysis entry in the history, **When** the user clicks on it, **Then** they see the original image and analysis summary
3. **Given** the backend does not support analysis history, **When** the user requests history, **Then** the system displays a message explaining the limitation

---

### Edge Cases

- How does the layout handle RTL (Arabic) text expansion/contraction when displaying long problem descriptions or recommendations?
- What happens when authentication tokens expire during the upload and analysis flow?
- How does the system handle concurrent uploads or submissions from the same user?
- What happens when a user switches language mid-session while analysis results are loading?
- How does the system handle extremely large images (e.g., 20MB+) that might exceed backend limits?
- What happens when the AI analysis takes longer than the configured timeout (e.g., 60 seconds)?
- How does the system handle rapid-fire submissions that might exceed rate limits?
- What happens when a user has no remaining AI analysis quota?
- How does the system handle missing or incomplete AI responses from the backend?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-SEC**: Only authenticated users with valid JWT tokens can access the AI Image Analysis page and submit images.
- **FR-I18N**: UI MUST support full RTL/Arabic parity using existing i18n infrastructure.
- **FR-VAL**: All image files MUST be validated against backend validation rules (format, size, content).
- **FR-DESIGN**: All UI MUST maintain existing design system, color palette, spacing, and typography without redesigning existing pages.
- **FR-001**: System MUST allow users to upload images in JPG, JPEG, PNG, or WEBP formats only.
- **FR-002**: System MUST validate image file size against backend restrictions (e.g., maximum 10MB per image).
- **FR-003**: System MUST display validation errors for invalid or rejected images before submission.
- **FR-004**: System MUST allow users to preview uploaded images, replace images, or remove images without page refresh.
- **FR-005**: System MUST display a loading indicator while image upload is in progress.
- **FR-006**: System MUST display a loading indicator while AI analysis is processing.
- **FR-007**: System MUST prevent duplicate submissions during upload or analysis.
- **FR-008**: System MUST display problem title, category, description, confidence score, and severity level from AI response.
- **FR-009**: System MUST display problem findings as a structured list from AI response.
- **FR-010**: System MUST display recommendations dynamically from AI response, supporting multiple ordered recommendations.
- **FR-011**: System MUST display severity visually while preserving the existing design system (e.g., color coding or icons).
- **FR-012**: System MUST display suggested service classification if backend provides it (service category, provider type, repair category).
- **FR-013**: System MUST handle backend errors gracefully and display user-friendly error messages (e.g., invalid image, timeout, rate limit).
- **FR-014**: System MUST never expose raw backend error messages or stack traces to users.
- **FR-015**: System MUST support mobile, tablet, and desktop layouts without redesigning UI.
- **FR-016**: System MUST allow analysis history view if backend supports it, otherwise display a message documenting the limitation.
- **FR-017**: System MUST show friendly rate limit messages when AI usage quota is exceeded.
- **FR-018**: System MUST prevent users from uploading or submitting images with invalid data.
- **FR-019**: System MUST ensure all AI requests flow through the backend (NestJS) and not directly to AI service.
- **FR-020**: System MUST attach JWT authentication tokens to all analysis requests.
- **FR-021**: System MUST comply with backend DTO structures and request payloads.
- **FR-022**: System MUST analyze the backend API to generate an API audit report documenting coverage and potential mismatches.

### Key Entities *(include if feature involves data)*

- **Analyzed Image**: Represents an uploaded image that has been processed by the AI. Attributes: image file, problem title, category, description, confidence score, severity level, AI findings, recommendations, service classification, analysis date, user ID.
- **AI Analysis Result**: Represents the structured output from the AI service. Attributes: problem detection details, classification (service category, provider type, repair category), severity assessment, actionable recommendations, confidence scores.
- **Analysis History Entry**: Represents a previous AI analysis. Attributes: image thumbnail, analysis date, problem summary, severity level.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can successfully upload and analyze an image in under 90 seconds from upload to results display.
- **SC-002**: 95% of valid images (supported formats, sizes) pass backend validation and trigger successful AI analysis.
- **SC-003**: Users can view detailed analysis results with all required information (problem title, category, description, confidence, severity, findings, recommendations) without confusion or missing data.
- **SC-004**: Error messages are displayed clearly for all error scenarios (invalid file, upload failure, timeout, rate limit) without exposing internal error details.
- **SC-005**: The system displays loading states during upload and analysis to prevent user frustration and duplicate submissions.
- **SC-006**: Users can successfully replace or remove uploaded images without page refresh for improved UX.
- **SC-007**: The AI Image Analysis page and results display are fully responsive across mobile, tablet, and desktop devices.
- **SC-008**: 100% of analysis results match the backend response structure exactly (no missing or fabricated fields).
- **SC-009**: No mock AI responses remain in the frontend codebase.

## Assumptions

- Users have stable internet connectivity required for image upload and AI analysis.
- The backend AI Gateway and AI Service are already implemented and available at the specified endpoints.
- Existing authentication infrastructure (JWT tokens) will be reused and require no changes.
- The backend has established validation rules for images that will serve as the source of truth for frontend validation.
- The backend AI Service supports image analysis for home repair problems (plumbing, electrical, carpentry, HVAC, painting, appliance repair).
- Users understand they cannot directly interact with the AI service from the frontend.
- Mobile browsers support the image upload and preview functionality required for the feature.
- Analysis history is supported by the backend or can be documented as a limitation without implementation.
- The existing design system, color palette, spacing, and typography will remain unchanged throughout implementation.
- Users may upload multiple images and receive multiple analysis results over time.
- The AI analysis will return structured responses with well-defined fields (problem detection, severity, recommendations, service classification).
- Users are authenticated users with valid JWT tokens before accessing the analysis page.
- The backend has rate limiting and quota management in place for AI requests.
- No specific maximum number of AI analyses per user is defined; backend quotas will be respected.