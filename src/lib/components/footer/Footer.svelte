<script lang="ts">
	import { resolve } from '$app/paths';

	const year = new Date().getFullYear();
</script>

<div class="footer">
	<div class="footer__inner container">
		<nav class="footer__nav" aria-label="Footer navigation">
			<a href={resolve('/board/')} class="footer__nav-link">Company Info</a>
			<a href={resolve('/board/')} class="footer__nav-link">Terms of Service</a>
			<a href={resolve('/board/')} class="footer__nav-link footer__nav-link--bold">Privacy Policy</a
			>
			<a href={resolve('/board/')} class="footer__nav-link">Usage Guide</a>
		</nav>

		<div class="footer__body">
			<div class="footer__company">
				<div class="footer__brand">
					<i class="ph ph-storefront" aria-hidden="true"></i>
					<span>DEMO STORE</span>
				</div>

				<div class="footer__details">
					<p>
						Company: Demo Store Inc. <span class="footer__sep">|</span> CEO: John Smith
						<span class="footer__sep">|</span> Reg. No.: 123-45-67890
					</p>
					<p>
						Address: 123 Commerce Blvd, Suite 300, San Francisco, CA 94105
						<span class="footer__sep">|</span> Phone: 1-800-555-0199
					</p>
					<p>Privacy Officer: Jane Doe (privacy@demostore.com)</p>
					<p>
						E-commerce License: 2024-SF-01234
						<a href={resolve('/board/')} class="footer__verify">Verify License</a>
					</p>
				</div>

				<p class="footer__copy">
					Copyright &copy; {year} Demo Store Inc. All rights reserved.
				</p>
			</div>

			<div class="footer__service">
				<p class="footer__service-label">Customer Service</p>
				<p class="footer__service-phone">1-800-555-0199</p>
				<p class="footer__service-note">Phone support has ended. Please contact us via email.</p>

				<div class="footer__service-hours">
					<p>Weekdays (Mon–Fri): 10:00 – 17:30</p>
					<p>Lunch: 12:00 – 13:00 (Service paused)</p>
					<p>Weekends &amp; holidays: Closed</p>
				</div>

				<div class="footer__service-bank">
					<p>Bank of America <strong>1000-3557-2280</strong></p>
					<p>Account holder: Demo Store Inc.</p>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.footer {
		background-color: #fff;
		border-top: 1px solid var(--color-border);
		margin-top: auto;
	}

	.footer__inner {
		padding-block: var(--spacing-8);
	}

	/* Nav links */
	.footer__nav {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-5);
		padding-bottom: var(--spacing-6);
		border-bottom: 1px solid var(--color-border);
		margin-bottom: var(--spacing-6);
	}
	.footer__nav-link {
		font-size: var(--font-size-sm);
		font-weight: 500;
		color: #171411;
		transition: color var(--transition-fast);
	}
	.footer__nav-link:hover {
		color: var(--color-text-muted);
	}
	.footer__nav-link--bold {
		font-weight: 700;
	}

	/* Body grid */
	.footer__body {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: var(--spacing-12);
	}

	/* Brand */
	.footer__brand {
		display: flex;
		align-items: center;
		gap: var(--spacing-2);
		margin-bottom: var(--spacing-5);
		font-size: var(--font-size-xl);
		font-weight: 700;
		color: #171411;
	}
	.footer__brand i {
		font-size: 1.5rem;
	}

	/* Company details */
	.footer__details {
		margin-bottom: var(--spacing-4);
	}
	.footer__details p {
		font-size: var(--font-size-xs);
		line-height: 1.75;
		color: #888;
	}
	.footer__verify {
		display: inline-block;
		margin-left: var(--spacing-2);
		padding: 2px var(--spacing-2);
		font-size: var(--font-size-xs);
		color: #666;
		border: 1px solid #ccc;
		border-radius: var(--radius-sm);
		transition:
			border-color var(--transition-fast),
			color var(--transition-fast);
	}
	.footer__verify:hover {
		color: #171411;
		border-color: #999;
	}
	.footer__copy {
		font-size: var(--font-size-xs);
		color: #888;
	}
	.footer__sep {
		margin-inline: var(--spacing-1);
		color: #ccc;
	}

	/* Service column */
	.footer__service {
		min-width: 260px;
	}
	.footer__service-label {
		font-size: var(--font-size-sm);
		font-weight: 500;
		color: #171411;
		margin-bottom: var(--spacing-2);
	}
	.footer__service-phone {
		font-size: clamp(1.25rem, 2.5vw, 1.75rem);
		font-weight: 700;
		color: #171411;
		line-height: 1.2;
		margin-bottom: var(--spacing-2);
	}
	.footer__service-note {
		font-size: var(--font-size-xs);
		color: #888;
		margin-bottom: var(--spacing-4);
	}
	.footer__service-hours {
		margin-bottom: var(--spacing-5);
	}
	.footer__service-hours p {
		font-size: var(--font-size-xs);
		line-height: 1.75;
		color: #666;
	}
	.footer__service-bank p {
		font-size: var(--font-size-xs);
		color: #666;
		line-height: 1.75;
	}
	.footer__service-bank strong {
		font-size: var(--font-size-lg);
		font-weight: 700;
		color: #171411;
	}

	/* Responsive */
	@media (max-width: 959px) {
		.footer__body {
			grid-template-columns: 1fr;
			gap: var(--spacing-8);
		}
		.footer__service {
			min-width: 0;
			padding-top: var(--spacing-6);
			border-top: 1px solid var(--color-border);
		}
	}

	@media (max-width: 639px) {
		.footer__inner {
			padding-block: var(--spacing-6);
		}
		.footer__nav {
			gap: var(--spacing-3) var(--spacing-4);
			padding-bottom: var(--spacing-4);
			margin-bottom: var(--spacing-4);
		}
		.footer__nav-link {
			font-size: var(--font-size-xs);
		}
		.footer__brand {
			margin-bottom: var(--spacing-3);
			font-size: var(--font-size-base);
		}
		.footer__brand i {
			font-size: 1.2rem;
		}
		.footer__sep {
			display: none;
		}
		.footer__details p {
			font-size: 0.6875rem;
			line-height: 1.5;
		}
		.footer__body {
			gap: var(--spacing-6);
		}
		.footer__service {
			padding-top: var(--spacing-4);
		}
	}
</style>
