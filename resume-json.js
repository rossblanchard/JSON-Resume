

async function loadResumeData() {
	try {
		// Get the selected resume from sessionStorage
		const selectedResume = sessionStorage.getItem('selectedResume') || 'resume-data.json';
		
		// Fetch the JSON file
		const response = await fetch(selectedResume + '?v=' + new Date().getTime());  // the ?v= adds a unique query parameter to each request, forcing the browser to fetch fresh data instead of using the cached version
		
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		
		const data = await response.json();
		
		// Hide loading message
		document.getElementById('loading').style.display = 'none';
		
		// Generate the resume
		generateResume(data);
		
	} catch (error) {
		document.getElementById('loading').style.display = 'none';
		document.getElementById('error').style.display = 'block';
		document.getElementById('error').textContent = 
			'Error loading resume data: ' + error.message + 
			'\n\nMake sure resume-data.json is in the same directory as this HTML file.';
		console.error('Error loading resume:', error);
	}
}

function generateResume(data) {
	const container = document.getElementById('resume-content');
	
	/* 
	
	Personal Information Section
	
	*/
	
	let html = `
		<header>
			<h1>${data.personalInfo.name}</h1>
			<div class="contact-info">
				${data.personalInfo.address} | ${data.personalInfo.email} | ${data.personalInfo.phone}
			</div>
		</header>
	`;
	
	/*
	
	 Professional Summary Section
	 
	 */
	 
	 
	html += `
		<div class="section">
			<h2>Professional Summary</h2>
			<p class="summary">${data.summary}</p>
		</div>
	`;
	
	/*
	
	 Skills Section
	 
	 
	 */
	 
	html += `<div class="section"><h2>Core Competencies</h2><div class="skills-grid">`;
	
	// Iterate through skills in order as they are in json. join with a pipe char |
	
	
	Object.keys(data.skills).forEach(category => {
		const skill = data.skills[category];
		
		// there's some clunky shit for AI/ML skills that could use some refactoring. If no AI/ML object exists in JSON, don't show the category. This is for future expansion. 
		
		if (category === 'aiMachineLearning') {
			const aiml = skill;
			const hasContent = (aiml.concepts && aiml.concepts.length > 0) || 
							 (aiml.technologies && aiml.technologies.length > 0) || 
							 (aiml.capabilities && aiml.capabilities.length > 0);
			
			if (hasContent) {
				html += `<div class="skill-category"><div class="skill-category-name">${skill.label}:</div>`;
				if (aiml.concepts && aiml.concepts.length > 0) {
					html += `<div class="skill-list">Concepts: ${aiml.concepts.join(', ')}</div>`;
				}
				if (aiml.technologies && aiml.technologies.length > 0) {
					html += `<div class="skill-list">Technologies: ${aiml.technologies.join(', ')}</div>`;
				}
				if (aiml.capabilities && aiml.capabilities.length > 0) {
					html += `<div class="skill-list">Capabilities: ${aiml.capabilities.join(', ')}</div>`;
				}
				html += `</div>`;
			}
		} else if (skill.items && skill.items.length > 0) {
			html += `
				<div class="skill-category">
					<div class="skill-category-name">${skill.label}:</div>
					<div class="skill-list">${skill.items.join(' <strong>|</strong> ')}</div>
				</div>
			`;
		}
	});
	
	html += `</div></div>`;
	
	/*
	
	Experience Section
	
	*/
	
	html += `<div class="section"><h2>Professional Experience</h2>`;
	data.experience.forEach(job => {
		const locationStr = job.location ? ` | ${job.location}` : '';
		html += `
			<div class="job">
				<div class="job-header clearfix">
					<div class="job-title">${job.title} | ${job.company}${locationStr}</div>
					<div class="date">${job.startDate} - ${job.endDate}</div>
				</div>
				<ul>
		`;
		job.responsibilities.forEach(resp => {
			html += `<li>${resp}</li>`;
		});
		html += `</ul></div>`;
	});
	html += `</div>`;
	
	/*
	
	Education Section
	
	*/
	
	html += `<div class="section"><h2>Education</h2>`;
	data.education.forEach(edu => {
		html += `
			<div class="education-item">
				<div class="edu-header clearfix">
					<div class="edu-degree">${edu.degree}</div>
				</div>
				<div class="institution">${edu.institution}, ${edu.location}</div>
			</div>
		`;
	});
	html += `</div>`;
	
	// Volunteerism
	html += `<div class="section"><h2>Volunteerism & Community Involvement</h2>`;
	data.volunteerism.forEach(vol => {
		html += `
			<div class="volunteer-item">
				<div class="vol-header clearfix">
					<div class="vol-title">${vol.title} | ${vol.organization}${vol.location ? ' | ' + vol.location : ''} </div>
					<div class="date">${vol.startDate} - ${vol.endDate}</div>
				</div>
				<!-- <div class="organization">${vol.organization}${vol.location ? ', ' + vol.location : ''}</div> -->
				${vol.description ? `<div class="skill-list">${vol.description}</div>` : ''}
			</div>
		`;
	});
	html += `</div>`;
	
	container.innerHTML = html;
}

// Load the resume json data when the html page loads

loadResumeData();