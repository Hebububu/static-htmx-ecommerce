<script lang="ts">
	import { base } from '$app/paths';
</script>

<footer class="bg-(--color-primary) text-white mt-auto">
	<div class="max-w-(--container-max) mx-auto px-4 md:px-6 py-10">
		<div class="grid grid-cols-1 md:grid-cols-4 gap-8">
			<div>
				<h3 class="text-lg font-bold mb-4">E-Commerce</h3>
				<p class="text-sm text-neutral-400 leading-relaxed">
					123 Commerce Street<br />
					Business Registration: 123-45-67890<br />
					CEO: John Doe
				</p>
			</div>

			<div>
				<h4 class="font-medium mb-3 text-sm">Customer Service</h4>
				<ul class="space-y-2 text-sm text-neutral-400">
					<li>
						<a href="{base}/board/notices/" class="hover:text-white transition-colors"
							>Announcements</a
						>
					</li>
					<li><a href="{base}/board/" class="hover:text-white transition-colors">FAQ</a></li>
					<li>Phone: 1-800-000-0000</li>
					<li>Email: help@ecommerce.com</li>
				</ul>
			</div>

			<div>
				<h4 class="font-medium mb-3 text-sm">Shopping Guide</h4>
				<ul class="space-y-2 text-sm text-neutral-400">
					<li>
						<a href="{base}/board/" class="hover:text-white transition-colors">Terms of Service</a>
					</li>
					<li>
						<a href="{base}/board/" class="hover:text-white transition-colors">Privacy Policy</a>
					</li>
					<li>
						<a href="{base}/board/" class="hover:text-white transition-colors">Shipping Info</a>
					</li>
					<li>
						<a href="{base}/board/" class="hover:text-white transition-colors"
							>Returns & Exchanges</a
						>
					</li>
				</ul>
			</div>

			<div>
				<h4 class="font-medium mb-3 text-sm">Newsletter</h4>
				<p class="text-sm text-neutral-400 mb-3">Get the latest deals and event updates.</p>
				<div class="flex gap-2">
					<input
						type="email"
						placeholder="Email address"
						class="flex-1 px-3 py-2 text-sm bg-neutral-800 border border-neutral-700 rounded-(--radius-sm) text-white placeholder:text-neutral-500 focus:outline-none focus:border-(--color-accent)"
					/>
					<button
						class="px-4 py-2 text-sm font-medium bg-(--color-accent) rounded-(--radius-sm) hover:opacity-90 transition-opacity"
					>
						Subscribe
					</button>
				</div>
			</div>
		</div>

		<div class="mt-8 pt-6 border-t border-neutral-700 text-center text-xs text-neutral-500">
			&copy; 2026 E-Commerce. All rights reserved.
		</div>
	</div>
</footer>
